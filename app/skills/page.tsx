// /skills — 바로스킬 홈
// Hero, 카테고리 그리드, 추천 스킬

import Link from 'next/link';
import {
  getCategories,
  getFeaturedSkills,
  getRecentSkills,
} from '@/lib/skills/queries';
import { SkillCard } from '@/components/skills/SkillCard';

export default async function SkillsHomePage() {
  const [categories, featured, recent] = await Promise.all([
    getCategories(),
    getFeaturedSkills(12),
    getRecentSkills(6),
  ]);

  return (
    <div className="space-y-14">
      <section>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          내 직무에 필요한 AI 스킬,
          <br />
          <span className="text-stone-500">한곳에서.</span>
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl">
          영업·마케팅·콘텐츠·기획 직무에서 바로 쓸 수 있는 AI 스킬을
          큐레이션합니다. Claude·Codex·Cursor 어디서든 1-클릭으로 추가.
        </p>
      </section>

      <section>
        <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">
          카테고리
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/skills/${cat.slug}`}
              className="group p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all hover:-translate-y-0.5"
            >
              <div
                className="w-2 h-8 rounded-full mb-3"
                style={{ backgroundColor: cat.accent_color ?? '#888' }}
                aria-hidden="true"
              />
              <h3 className="font-semibold mb-1">{cat.name_ko}</h3>
              <p className="text-xs text-stone-500 line-clamp-2">
                {cat.description_ko}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            추천 스킬
          </h2>
          <Link
            href="/skills/guide"
            className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            설치 가이드 →
          </Link>
        </div>

        {featured.length === 0 ? (
          <EmptyState>
            아직 게시된 스킬이 없습니다. 시드 스킬이 곧 등록됩니다.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              최근 추가
            </h2>
            <Link
              href="/skills/submit"
              className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            >
              + 스킬 제출
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-12 text-center text-stone-500 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
      {children}
    </div>
  );
}
