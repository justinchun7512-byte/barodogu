// /skills/[category] — 카테고리 페이지
// 예: /skills/sales, /skills/marketing, /skills/content, /skills/planning, /skills/korean

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getCategoryBySlug,
  getSkillsByCategory,
} from '@/lib/skills/queries';
import { SkillCard } from '@/components/skills/SkillCard';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name_ko} 스킬 — 바로스킬`,
    description: category.description_ko ?? undefined,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const skills = await getSkillsByCategory(slug);

  return (
    <div className="space-y-8">
      <header
        className="border-l-4 pl-4 py-1"
        style={{ borderColor: category.accent_color ?? '#888' }}
      >
        <h1 className="text-3xl font-bold mb-1">{category.name_ko}</h1>
        {category.description_ko && (
          <p className="text-stone-600 dark:text-stone-400">
            {category.description_ko}
          </p>
        )}
        <p className="text-sm text-stone-500 mt-2">{skills.length}개 스킬</p>
      </header>

      {skills.length === 0 ? (
        <div className="p-12 text-center text-stone-500 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
          이 카테고리에는 아직 스킬이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
