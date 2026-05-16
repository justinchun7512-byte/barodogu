// POST /api/skills/submit
// 익명 사용자가 새 스킬을 제출. status='pending' 으로 저장 → 어드민 검토.
//
// 가드:
//  1) Honeypot (`website_url`) 채워지면 silent 200 (스팸봇 속이기)
//  2) 필수 필드 + 길이 검증 (DB constraint 와 이중 가드)
//  3) Rate limit: 같은 ip_hash 60초 내 5건, 1시간 내 20건 차단
//  4) 같은 ip + skill_name + category 1시간 내 중복 차단
//
// 알림: 신규 제출 1건 들어오면 텔레그램 봇으로 대표 chat_id 에 알림 (env 있을 때만)

import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { createAnonClient } from '@/lib/supabase/anon';

export const runtime = 'nodejs';

const CATEGORIES = ['sales', 'marketing', 'content', 'planning', 'korean'] as const;
type CategorySlug = (typeof CATEGORIES)[number];

interface SubmitBody {
  skill_name?: string;
  category_slug?: string;
  description?: string;
  compatible_with?: string[];
  example?: string;
  source_url?: string;
  license?: string;
  submitter_handle?: string;
  submitter_contact?: string;
  // Honeypot — 사용자에게 보이지 않는 hidden 필드. 채워져 있으면 봇.
  website_url?: string;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function hashIp(ip: string): string {
  const salt = process.env.SUBMISSION_IP_SALT ?? 'naeilmo-2026-skill';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

async function notifyTelegram(payload: {
  skill_name: string;
  category_slug: string;
  description: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID ?? '8125012961';
  if (!token) return;
  const text =
    `📥 새 스킬 제출\n\n` +
    `▌이름: ${payload.skill_name}\n` +
    `▌카테고리: ${payload.category_slug}\n` +
    `▌설명: ${payload.description.slice(0, 200)}${payload.description.length > 200 ? '…' : ''}\n\n` +
    `어드민에서 검토: /admin/dashboard/skills`;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.error('[skills/submit] telegram notify failed', err);
  }
}

export async function POST(req: Request) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return bad('invalid_json');
  }

  // 1) Honeypot — silent 200
  if (body.website_url && body.website_url.length > 0) {
    return NextResponse.json({ ok: true, spam: true });
  }

  // 2) 필수 + 길이 가드
  const skill_name = body.skill_name?.trim() ?? '';
  const category_slug = body.category_slug?.trim() as CategorySlug | '';
  const description = body.description?.trim() ?? '';
  const compatible_with = Array.isArray(body.compatible_with)
    ? body.compatible_with.filter((s) => typeof s === 'string').slice(0, 10)
    : [];

  if (skill_name.length < 2 || skill_name.length > 80) {
    return bad('skill_name_length');
  }
  if (!CATEGORIES.includes(category_slug as CategorySlug)) {
    return bad('invalid_category');
  }
  if (description.length < 10 || description.length > 2000) {
    return bad('description_length');
  }
  const example = body.example?.trim() || null;
  if (example && example.length > 4000) return bad('example_length');
  const source_url = body.source_url?.trim() || null;
  if (source_url && source_url.length > 500) return bad('source_url_length');
  if (source_url && !/^https?:\/\//i.test(source_url)) return bad('source_url_format');
  const license = body.license?.trim() || null;
  const submitter_handle = body.submitter_handle?.trim() || null;
  if (submitter_handle && submitter_handle.length > 80) return bad('submitter_length');
  const submitter_contact = body.submitter_contact?.trim() || null;
  if (submitter_contact && submitter_contact.length > 200) return bad('contact_length');

  const ip = getClientIp(req);
  const ip_hash = hashIp(ip);
  const user_agent = (req.headers.get('user-agent') ?? '').slice(0, 500);

  const supabase = createAnonClient();

  // 3) Rate limit
  const now = Date.now();
  const oneMinAgo = new Date(now - 60_000).toISOString();
  const oneHourAgo = new Date(now - 60 * 60_000).toISOString();

  const { count: recentMin } = await supabase
    .from('skill_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash)
    .gte('created_at', oneMinAgo);
  if ((recentMin ?? 0) >= 5) return bad('rate_limit_minute', 429);

  const { count: recentHour } = await supabase
    .from('skill_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash)
    .gte('created_at', oneHourAgo);
  if ((recentHour ?? 0) >= 20) return bad('rate_limit_hour', 429);

  // 4) 동일 ip + 동일 (skill_name, category) 1h 중복 차단
  const { count: dup } = await supabase
    .from('skill_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash)
    .eq('skill_name', skill_name)
    .eq('category_slug', category_slug)
    .gte('created_at', oneHourAgo);
  if ((dup ?? 0) > 0) return bad('duplicate', 409);

  // INSERT
  const { error } = await supabase.from('skill_submissions').insert({
    skill_name,
    category_slug,
    description,
    compatible_with,
    example,
    source_url,
    license,
    submitter_handle,
    submitter_contact,
    ip_hash,
    user_agent,
  });

  if (error) {
    console.error('[skills/submit] insert error', error);
    return bad('insert_failed', 500);
  }

  // 알림 (실패해도 응답에 영향 없음)
  notifyTelegram({ skill_name, category_slug, description }).catch(() => {});

  return NextResponse.json({ ok: true });
}
