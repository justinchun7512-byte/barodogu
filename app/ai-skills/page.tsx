import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllAISkills } from '@/lib/ai-skills';

export const metadata: Metadata = {
  title: 'AI Skills 라이브러리 - 직장인용 무료 ChatGPT 프롬프트 모음 | 바로도구',
  description: '회의록·이메일·보고서·자소서 등 직장인이 매일 쓰는 ChatGPT 프롬프트를 무료로 정리. 복사해서 바로 사용 가능. 회원가입 없이 즉시 활용.',
  alternates: { canonical: 'https://barodogu.com/ai-skills' },
  openGraph: {
    title: 'AI Skills 라이브러리 - 직장인용 무료 ChatGPT 프롬프트',
    description: '회의록·이메일·보고서·자소서 등 직장인이 매일 쓰는 ChatGPT 프롬프트를 무료로 정리.',
    url: 'https://barodogu.com/ai-skills',
    type: 'website',
  },
};

export default function AISkillsListPage() {
  const skills = getAllAISkills();

  return (
    <main className="max-w-6xl mx-auto px-4 pt-20 pb-6">
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white">
          AI <span className="text-primary">Skills 라이브러리</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
          직장인이 매일 쓰는 ChatGPT 프롬프트를 무료로 모았습니다. 복사해서 바로 사용하세요.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Link
            key={skill.slug}
            href={`/ai-skills/${skill.slug}`}
            className="block p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{skill.category}</span>
              <span>{skill.readTime}</span>
            </div>
            <h2 className="text-lg font-semibold mb-2 dark:text-white">{skill.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{skill.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skill.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
