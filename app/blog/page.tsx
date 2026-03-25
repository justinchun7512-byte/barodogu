import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: '블로그 - 바로도구',
  description: '취업, 금융, 개발 등 실용적인 도구 활용 가이드와 팁을 제공합니다.',
  alternates: { canonical: 'https://barodogu.com/blog' },
  openGraph: {
    title: '블로그 - 바로도구',
    description: '취업, 금융, 개발 등 실용적인 도구 활용 가이드와 팁을 제공합니다.',
    url: 'https://barodogu.com/blog',
    type: 'website',
  },
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white">
          바로도구 <span className="text-primary">블로그</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          도구 활용 가이드와 실용적인 정보를 제공합니다
        </p>
      </section>

      {/* Card Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{post.readTime} 읽기</span>
            </div>
            <h2 className="text-lg font-bold mb-2 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {post.description}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-gray-400" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                읽어보기 &rarr;
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
