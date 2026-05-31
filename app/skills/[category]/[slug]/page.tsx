// /skills/[category]/[slug] — 스킬 상세 (JSON-LD + canonical + OG 포함)
// AdSense 친화 배치: 본문·예시가 상단, 설치 CTA 는 본문 아래

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createAnonClient } from '@/lib/supabase/anon';
import {
  getSkillByCategoryAndSlug,
  getSkillZipUrl,
} from '@/lib/skills/queries';
import { InstallModal } from '@/components/skills/InstallModal';
import {
  DIFFICULTY_LABEL,
  COMPATIBLE_TOOL_LABEL,
} from '@/types/skills';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://barodogu.com';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// ─────────────────────────────────────────────
// 빌드 시 정적 경로 생성 (색인 안정화)
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  // 빌드 타임에 호출되므로 쿠키 없는 anon 클라이언트 사용
  const supabase = createAnonClient();
  const { data } = await supabase
    .from('skills')
    .select('slug, category:categories!inner(slug)')
    .in('status', ['featured', 'curated']);

  return (data ?? [])
    .filter((s) => s.category && (s.category as any).slug)
    .map((s) => ({
      category: (s.category as any).slug as string,
      slug: s.slug as string,
    }));
}

export const dynamicParams = true;
export const revalidate = 3600; // 1시간

// ─────────────────────────────────────────────
// 메타데이터
// ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const skill = await getSkillByCategoryAndSlug(category, slug);
  if (!skill) return { robots: { index: false, follow: false } };

  const url = `${BASE_URL}/skills/${category}/${slug}`;
  const title = `${skill.name_ko} — 바로스킬`;
  const description = skill.description_ko;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: '바로도구',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

// ─────────────────────────────────────────────
// 페이지
// ─────────────────────────────────────────────
export default async function SkillDetailPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const skill = await getSkillByCategoryAndSlug(categorySlug, slug);
  if (!skill) notFound();

  const zipUrl = getSkillZipUrl(skill.zip_path);
  const canonical = `${BASE_URL}/skills/${categorySlug}/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#skill`,
        name: skill.name_ko,
        alternateName: skill.name_en ?? undefined,
        description: skill.description_ko,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform (Claude, Codex, Cursor)',
        url: canonical,
        inLanguage: 'ko-KR',
        license: skill.license ?? undefined,
        author: skill.source_author
          ? { '@type': 'Person', name: skill.source_author }
          : { '@type': 'Organization', name: '내일모코퍼레이션' },
        publisher: { '@type': 'Organization', name: '바로도구', url: BASE_URL },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
          availability: 'https://schema.org/InStock',
        },
        keywords: skill.tags.join(', '),
        datePublished: skill.published_at ?? undefined,
        dateModified: skill.updated_at,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '바로도구', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: '바로스킬', item: `${BASE_URL}/skills` },
          {
            '@type': 'ListItem',
            position: 3,
            name: skill.category?.name_ko ?? categorySlug,
            item: `${BASE_URL}/skills/${categorySlug}`,
          },
          { '@type': 'ListItem', position: 4, name: skill.name_ko, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto space-y-10">
        <nav className="text-sm text-stone-500" aria-label="breadcrumb">
          <Link
            href="/skills"
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            바로스킬
          </Link>
          {' / '}
          <Link
            href={`/skills/${categorySlug}`}
            className="hover:text-stone-900 dark:hover:text-stone-100"
          >
            {skill.category?.name_ko}
          </Link>
        </nav>

        <header>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {skill.name_ko}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            {skill.description_ko}
          </p>

          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            <Pill>{DIFFICULTY_LABEL[skill.difficulty]}</Pill>
            {skill.compatible_with.map((tool) => (
              <Pill key={tool}>{COMPATIBLE_TOOL_LABEL[tool] ?? tool}</Pill>
            ))}
            {skill.license && <Pill>{skill.license}</Pill>}
            {skill.source_type === 'internal' && (
              <Pill tone="emerald">자체 제작</Pill>
            )}
          </div>
        </header>

        {skill.description_long_ko && (
          <section>
            <h2 className="text-xl font-bold mb-3">이 스킬이 할 수 있는 일</h2>
            <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-lg prose-h3:text-base prose-table:my-4 prose-th:bg-stone-100 dark:prose-th:bg-stone-800 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-table:border prose-table:border-stone-200 dark:prose-table:border-stone-700">
              <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                {skill.description_long_ko}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {skill.examples.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">예시</h2>
            <div className="space-y-5">
              {skill.examples.map((ex) => (
                <div
                  key={ex.id}
                  className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 bg-white dark:bg-stone-900"
                >
                  {ex.prompt_example && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-stone-500 mb-1.5">
                        예시 프롬프트
                      </div>
                      <pre className="text-sm bg-stone-50 dark:bg-stone-950 p-3 rounded-lg whitespace-pre-wrap font-mono">
                        {ex.prompt_example}
                      </pre>
                    </div>
                  )}
                  {(ex.before_text || ex.after_text) && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {ex.before_text && (
                        <div>
                          <div className="text-xs font-medium text-stone-500 mb-1.5">
                            Before
                          </div>
                          <div className="text-sm p-3 rounded-lg bg-stone-50 dark:bg-stone-950 prose prose-sm prose-stone dark:prose-invert max-w-none prose-table:my-2 prose-th:bg-stone-100 dark:prose-th:bg-stone-800 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1 prose-table:text-xs prose-p:my-1">
                            <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                              {ex.before_text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                      {ex.after_text && (
                        <div>
                          <div className="text-xs font-medium text-stone-500 mb-1.5">
                            After
                          </div>
                          <div className="text-sm p-3 rounded-lg bg-stone-50 dark:bg-stone-950 prose prose-sm prose-stone dark:prose-invert max-w-none prose-table:my-2 prose-th:bg-stone-100 dark:prose-th:bg-stone-800 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1 prose-table:text-xs prose-p:my-1">
                            <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                              {ex.after_text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-stone-200 dark:border-stone-800 pt-8">
          <h2 className="text-xl font-bold mb-3">설치</h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
            사용 중인 AI 도구를 선택하면 1분 안에 추가할 수 있습니다.
          </p>
          <InstallModal skill={skill} zipUrl={zipUrl} />
        </section>

        <footer className="border-t border-stone-200 dark:border-stone-800 pt-6 text-sm text-stone-500 space-y-1">
          <div>
            출처:{' '}
            {skill.source_type === 'internal'
              ? '내일모코퍼레이션 자체 제작'
              : skill.source_author ?? '커뮤니티'}
          </div>
          {skill.source_repo_url && (
            <div>
              <a
                href={skill.source_repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-stone-900 dark:hover:text-stone-100"
              >
                원본 저장소 보기 →
              </a>
            </div>
          )}
          {skill.license && (
            <div>
              라이선스: <strong>{skill.license}</strong>
            </div>
          )}
          <div className="text-xs text-stone-400 pt-2">
            외부 코드를 자신의 환경에 추가할 때는 항상 SKILL.md 내용을 한 번
            확인하세요.
          </div>
        </footer>
      </article>
    </>
  );
}

function Pill({
  children,
  tone = 'stone',
}: {
  children: React.ReactNode;
  tone?: 'stone' | 'emerald';
}) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200'
      : 'bg-stone-100 dark:bg-stone-800';
  return <span className={`px-2 py-1 rounded-md ${cls}`}>{children}</span>;
}
