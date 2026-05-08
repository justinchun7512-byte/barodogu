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
    <main className="max-w-6xl mx-auto px-4 pt-20 pb-6">
      {/* Hero */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white">
          바로도구 <span className="text-primary">블로그</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          도구 활용 가이드와 실용적인 정보를 제공합니다
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto mb-10 px-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300 space-y-3">
        <p>
          바로도구 블로그는 사이트에서 제공하는 무료 도구를 실제 상황에 어떻게 활용하는지 안내하는 가이드를 모아둔 곳입니다. 단순히 도구의 기능을 나열하는 것이 아니라, 취업·이직·연봉 협상·다이어트·이사·건강 검진처럼 누구나 한 번쯤 만나는 상황에서 어떤 도구를 어떤 순서로 쓰면 가장 효과적인지를 단계별로 설명합니다.
        </p>
        <p>
          글 한 편당 약 5~8분이면 읽을 수 있도록 핵심만 추려서 작성하고, 각 가이드는 도구 페이지로의 직접 링크를 함께 제공합니다. 이력서 글자수를 빠르게 맞추는 법, 퇴직금과 실업급여를 한 번에 비교하는 법, BMI 결과를 보고 다음 액션을 정하는 법, MBTI 궁합과 이름 궁합을 함께 활용하는 법처럼 실전 시나리오 중심으로 정리했습니다.
        </p>
        <p>
          새 글은 매주 발행되며, 각 글의 카테고리는 취업/직장인·금융/세무·건강/다이어트·생활/재미·파일/개발 등으로 분류됩니다. 카테고리에 관심 가는 키워드가 있으면 먼저 그 글부터 읽어 보시고, 글 마지막에 안내된 도구를 바로 사용해 보시는 흐름을 권장합니다. 모든 도구는 회원가입 없이 즉시 이용 가능하니 글을 읽다가 막히는 순간에 부담 없이 도구로 이동해 결과를 확인하고 다시 글로 돌아올 수 있습니다.
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
