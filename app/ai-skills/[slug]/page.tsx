import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAISkill, getAllAISkillSlugs } from '@/lib/ai-skills';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAISkillSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getAISkill(slug);
  if (!skill) return {};

  const url = `https://barodogu.com/ai-skills/${skill.slug}`;
  const ogImage = `https://barodogu.com/api/og?title=${encodeURIComponent(skill.title)}&desc=${encodeURIComponent(skill.description.slice(0, 80))}`;

  return {
    title: `${skill.title} | 바로도구`,
    description: skill.description,
    keywords: skill.tags,
    alternates: { canonical: url },
    // 2026-05-31: AdSense 재신청 전 색인 정상화. /ai-skills/* noindex.
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title: skill.title,
      description: skill.description,
      url,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: skill.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: skill.title,
      description: skill.description,
      images: [ogImage],
    },
  };
}

export default async function AISkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = getAISkill(slug);
  if (!skill) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 pt-20 pb-12">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link href="/" className="hover:text-primary">바로도구</Link>
        <span className="mx-1">›</span>
        <Link href="/ai-skills" className="hover:text-primary">AI Skills</Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{skill.category}</span>
          <span>{skill.readTime}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3 dark:text-white">{skill.title}</h1>
        <p className="text-base text-gray-600 dark:text-gray-300">{skill.description}</p>
      </header>

      <section className="my-6 p-5 rounded-2xl border-2 border-primary bg-primary/5">
        <div className="text-xs uppercase tracking-wide text-primary mb-2">📋 복사해서 바로 사용</div>
        <p className="text-sm md:text-base font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{skill.promptCopy}</p>
      </section>

      <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        {skill.content.map((section, i) => (
          <section key={i} className="mb-6">
            {section.heading && <h2 className="text-xl font-semibold mt-6 mb-3 dark:text-white">{section.heading}</h2>}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </article>

      <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">관련 도구로 결과물 마무리하기:</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/tools/spell-checker" className="px-3 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary">한국어 맞춤법 검사기</Link>
          <Link href="/tools/character-counter" className="px-3 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary">글자수 세기</Link>
          <Link href="/ai-skills" className="px-3 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary">← 다른 프롬프트 보기</Link>
        </div>
      </footer>
    </main>
  );
}
