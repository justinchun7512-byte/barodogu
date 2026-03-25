import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs } from '@/lib/blog-posts';

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

  return {
    title: `${post.title} - 바로도구`,
    description: post.description,
    alternates: { canonical: `https://barodogu.com/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} - 바로도구`,
      description: post.description,
      url: `https://barodogu.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
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

      {/* Content */}
      <article className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        {post.content.map((section, index) => (
          <section key={index}>
            {section.heading && (
              <h2 className="text-xl font-bold mb-3 dark:text-white">
                {section.heading}
              </h2>
            )}
            <p className="text-base leading-7">{section.body}</p>
          </section>
        ))}
      </article>

      <hr className="border-gray-200 dark:border-gray-800 my-8" />

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
