import Link from 'next/link';
import { Tool, TOOLS, getCategoryInfo } from '@/lib/tools';
import { ShareButtons } from '@/components/tools/ShareButtons';
import { AdSlot } from '@/components/tools/AdSlot';

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  guideContent?: React.ReactNode;
  disclaimer?: React.ReactNode;
}

export function ToolLayout({ tool, children, guideContent, disclaimer }: ToolLayoutProps) {
  const categoryInfo = getCategoryInfo(tool.category);
  const relatedTools = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

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

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 dark:text-white">관련 도구</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    </main>
  );
}
