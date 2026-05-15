// 바로스킬 섹션 공통 레이아웃
// 미니 헤더 ("바로스킬 — 일에 바로 쓰는 AI 스킬 모음") + 카테고리 네비

import Link from 'next/link';
import { getCategories } from '@/lib/skills/queries';

export const metadata = {
  title: '바로스킬 — 일에 바로 쓰는 AI 스킬 모음 | 바로도구',
  description:
    '영업·마케팅·콘텐츠·기획 직무에서 바로 쓸 수 있는 한국어 AI 스킬을 큐레이션합니다. Claude·Codex·Cursor 어디서든 1-클릭으로 추가하세요.',
};

export default async function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <Link
              href="/skills"
              className="text-2xl font-bold tracking-tight hover:opacity-80"
            >
              바로스킬
            </Link>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              일에 바로 쓰는 AI 스킬 모음
            </span>
          </div>

          <nav
            className="mt-4 flex flex-wrap gap-2"
            aria-label="카테고리"
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/skills/${cat.slug}`}
                className="px-3 py-1.5 rounded-full text-sm font-medium border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 transition-colors"
              >
                {cat.name_ko}
              </Link>
            ))}
            <span className="grow" />
            <Link
              href="/skills/submit"
              className="px-3 py-1.5 rounded-full text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            >
              + 스킬 제출
            </Link>
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
