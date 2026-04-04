import Link from 'next/link';
import { Tool, TOOLS, getCategoryInfo } from '@/lib/tools';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { ShareButtons } from '@/components/tools/ShareButtons';
import { AdSlot } from '@/components/tools/AdSlot';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  guideContent?: React.ReactNode;
  disclaimer?: React.ReactNode;
  seoContent?: React.ReactNode;
}

export function ToolLayout({ tool, children, guideContent, disclaimer, seoContent }: ToolLayoutProps) {
  const categoryInfo = getCategoryInfo(tool.category);
  const relatedTools = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4);
  const relatedPosts = BLOG_POSTS.filter(p => p.toolLink === `/tools/${tool.id}`).slice(0, 3);
  // Also include posts from same-category tools if not enough
  const sameCategoryToolIds = TOOLS.filter(t => t.category === tool.category).map(t => t.id);
  const extraPosts = relatedPosts.length < 3
    ? BLOG_POSTS.filter(p => sameCategoryToolIds.some(id => p.toolLink === `/tools/${id}`) && !relatedPosts.includes(p)).slice(0, 3 - relatedPosts.length)
    : [];
  const allRelatedPosts = [...relatedPosts, ...extraPosts];

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span>/</span>
        <span>{categoryInfo?.name}</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">{tool.name}</h1>
          {tool.isNew && <span className="text-xs px-2 py-0.5 bg-secondary text-white rounded-full font-medium">NEW</span>}
          {tool.isHot && <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full font-medium">HOT</span>}
        </div>
        <p className="text-gray-500 dark:text-gray-400">{tool.description}</p>
      </div>

      {/* Tool Body */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-8 mb-6">
        {children}
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 text-xs text-gray-500 dark:text-gray-400 leading-relaxed space-y-1.5">
          {disclaimer}
        </div>
      )}

      {/* Share */}
      <ShareButtons title={tool.name} text={tool.description} />

      {/* Ad Slot */}
      <div className="my-8">
        <AdSlot format="leaderboard" />
      </div>

      {/* Guide */}
      {guideContent && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          {guideContent}
        </div>
      )}

      {/* SEO Content */}
      {seoContent && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          {seoContent}
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 dark:text-white">관련 도구</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {relatedTools.map(rt => (
              <Link
                key={rt.id}
                href={rt.isExternal ? rt.externalUrl! : `/tools/${rt.id}`}
                target={rt.isExternal ? '_blank' : undefined}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition flex items-center gap-3"
              >
                <span className="text-2xl">{rt.icon}</span>
                <div>
                  <p className="font-medium text-sm dark:text-white">{rt.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{rt.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Blog Posts */}
      {allRelatedPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 dark:text-white">관련 블로그 글</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allRelatedPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
              >
                <p className="font-medium text-sm dark:text-white mb-1 line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-gray-400">{post.readTime} 읽기</span>
                  <span className="text-[11px] text-primary font-medium">{post.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
