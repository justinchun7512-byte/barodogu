// 스킬 카드 — 홈·카테고리 페이지 공통
import Link from 'next/link';
import type { Skill, Category } from '@/types/skills';

interface Props {
  skill: Skill & { category?: Category | null };
}

export function SkillCard({ skill }: Props) {
  const categorySlug = skill.category?.slug;
  const href = categorySlug
    ? `/skills/${categorySlug}/${skill.slug}`
    : '#';

  return (
    <Link
      href={href}
      className="group block p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold leading-snug group-hover:underline">
          {skill.name_ko}
        </h3>
        {skill.status === 'featured' && (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-200">
            추천
          </span>
        )}
      </div>

      <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mb-3">
        {skill.description_ko}
      </p>

      <div className="flex flex-wrap gap-1.5 text-xs text-stone-500">
        {skill.category?.name_ko && (
          <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
            {skill.category.name_ko}
          </span>
        )}
        {skill.compatible_with.slice(0, 2).map((tool) => (
          <span
            key={tool}
            className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800"
          >
            {tool}
          </span>
        ))}
        {skill.source_type === 'internal' && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200">
            자체 제작
          </span>
        )}
      </div>
    </Link>
  );
}
