import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs } from '@/lib/blog-posts';
import { ShareButtons } from '@/components/tools/ShareButtons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://barodogu.com/blog/${post.slug}`;
  const ogImage = `https://barodogu.com/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.description.slice(0, 80))}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      locale: 'ko_KR',
      siteName: '바로도구',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `https://barodogu.com/blog/${post.slug}`;
  const ogImage = `https://barodogu.com/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.description.slice(0, 80))}`;

  // JSON-LD BlogPosting (네이버·구글 색인/리치스니펫)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.description,
    image: ogImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'justinchun',
      url: 'https://barodogu.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: '바로도구',
      logo: {
        '@type': 'ImageObject',
        url: 'https://barodogu.com/icon.png',
      },
    },
    articleSection: post.category,
    inLanguage: 'ko-KR',
  };

  return (
    <main className="max-w-3xl mx-auto px-4 pt-24 pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">홈</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">블로그</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readTime} 읽기</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
          {post.description}
        </p>
        <time
          className="block mt-4 text-sm text-gray-400"
          dateTime={post.date}
        >
          {new Date(post.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      <hr className="border-gray-200 dark:border-gray-800 mb-8" />

      {/* TLDR Box (GEO) */}
      {post.tldr && post.tldr.length > 0 && (
        <div className="mb-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">이 글의 핵심 요약</p>
          <ul className="space-y-1">
            {post.tldr.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <article className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        {post.content.map((section, index) => {
          const isFaq =
            section.heading?.includes('FAQ') ||
            section.heading?.includes('자주 묻는');

          if (isFaq) {
            // Q로 시작하는 항목으로 분리 (Q1. Q2. 등)
            const pairs = section.body.split(/(?=Q\d+\.)/).filter(s => s.trim());
            return (
              <section key={index}>
                {section.heading && (
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {section.heading}
                  </h2>
                )}
                <dl className="space-y-5">
                  {pairs.map((pair, i) => {
                    // A. 구분자 방식: "Q1. 질문? A. 답변"
                    const aIdx = pair.search(/ A\. /);
                    // → 구분자 방식: "Q1. 질문? → 답변"
                    const arrowIdx = pair.search(/ → /);

                    let q = pair.trim();
                    let a = '';

                    if (aIdx !== -1) {
                      q = pair.slice(0, aIdx).trim();
                      a = pair.slice(aIdx + 4).trim();
                    } else if (arrowIdx !== -1) {
                      q = pair.slice(0, arrowIdx).trim();
                      a = pair.slice(arrowIdx + 3).trim();
                    }

                    return (
                      <div key={i} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                        <dt className="font-semibold text-gray-900 dark:text-white mb-2">{q}</dt>
                        {a && <dd className="text-gray-600 dark:text-gray-400 leading-7">A. {a}</dd>}
                      </div>
                    );
                  })}
                </dl>
              </section>
            );
          }

          return (
            <section key={index}>
              {section.heading && (
                <h2 className="text-xl font-bold mb-3 dark:text-white">
                  {section.heading}
                </h2>
              )}
              <p className="text-base leading-7">{section.body}</p>
            </section>
          );
        })}
      </article>

      <hr className="border-gray-200 dark:border-gray-800 my-8" />

      {/* Share Buttons */}
      <div className="mb-8">
        <p className="text-sm text-center text-gray-400 mb-3">이 글이 도움됐다면 공유해 주세요</p>
        <ShareButtons title={post.title} text={post.description} />
      </div>

      {/* Tool CTA */}
      <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          이 글에서 소개한 도구를 바로 사용해 보세요
        </p>
        <Link
          href={post.toolLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          {post.toolName} 바로가기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Back to list */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-primary transition-colors"
        >
          &larr; 블로그 목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
