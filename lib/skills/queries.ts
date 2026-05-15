// 바로스킬 — 데이터 쿼리 계층
// 모든 페이지/컴포넌트가 이 파일을 통해 Supabase 에 접근

import { createClient } from '@/lib/supabase/server';
import type { Category, Skill, SkillWithExamples } from '@/types/skills';

// 공개 상태 (사용자에게 보이는 것만)
const PUBLIC_STATUSES = ['featured', 'curated'] as const;

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('[getCategories]', error);
    return [];
  }
  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

// ─────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────

export async function getFeaturedSkills(limit = 8): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*, category:categories(*)')
    .in('status', PUBLIC_STATUSES)
    // featured 먼저, 그 다음 최신순
    .order('status', { ascending: false })
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('[getFeaturedSkills]', error);
    return [];
  }
  return (data as Skill[]) ?? [];
}

export async function getSkillsByCategory(
  categorySlug: string
): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*, category:categories!inner(*)')
    .eq('category.slug', categorySlug)
    .in('status', PUBLIC_STATUSES)
    .order('status', { ascending: false })
    .order('like_count', { ascending: false })
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('[getSkillsByCategory]', error);
    return [];
  }
  return (data as Skill[]) ?? [];
}

export async function getSkillByCategoryAndSlug(
  categorySlug: string,
  skillSlug: string
): Promise<SkillWithExamples | null> {
  const supabase = await createClient();

  const { data: skill, error } = await supabase
    .from('skills')
    .select('*, category:categories!inner(*)')
    .eq('slug', skillSlug)
    .eq('category.slug', categorySlug)
    .in('status', PUBLIC_STATUSES)
    .maybeSingle();

  if (error || !skill) {
    if (error) console.error('[getSkillByCategoryAndSlug]', error);
    return null;
  }

  const { data: examples } = await supabase
    .from('skill_examples')
    .select('*')
    .eq('skill_id', skill.id)
    .order('sort_order');

  return { ...(skill as Skill), examples: examples ?? [] };
}

// ─────────────────────────────────────────────
// 스킬 zip 파일 다운로드 URL
// ─────────────────────────────────────────────

export function getSkillZipUrl(zipPath: string | null): string | null {
  if (!zipPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  // Supabase Storage public 버킷 (`skills`) 기준
  return `${base}/storage/v1/object/public/skills/${zipPath}`;
}
