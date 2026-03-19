import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getToolsByCategory, type Category } from '@/lib/tools';
import { ToolCard } from '@/components/tools/ToolCard';
import type { Metadata } from 'next';

const VALID_CATEGORIES: Category[] = ['employment', 'ai', 'image', 'finance', 'developer', 'fun'];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find(c => c.id === slug);
  if (!cat) return {};
  return {
    title: `${cat.name} 도구 모음 - 바로도구`,
    description: `${cat.name} 관련 무료 온라인 도구를 바로 사용하세요. 회원가입 없이 브라우저에서 바로 실행.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  if (!VALID_CATEGORIES.includes(slug as Category)) {
    notFound();
  }

  const category = slug as Category;
  const cat = CATEGORIES.find(c => c.id === category)!;
  const tools = getToolsByCategory(category);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{cat.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">
          {cat.icon} {cat.name} 도구
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {cat.name} 관련 무료 도구 {tools.length}개를 바로 사용하세요.
        </p>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">{cat.icon}</p>
          <p>이 카테고리의 도구는 준비 중입니다.</p>
          <Link href="/" className="text-primary hover:underline text-sm mt-2 inline-block">전체 도구 보기</Link>
        </div>
      )}
    </main>
  );
}
