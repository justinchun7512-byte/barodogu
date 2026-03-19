import Link from 'next/link';
import { Tool, getCategoryInfo } from '@/lib/tools';

export function ToolCard({ tool }: { tool: Tool }) {
  const cat = getCategoryInfo(tool.category);
  const href = tool.isExternal ? tool.externalUrl! : `/tools/${tool.id}`;

  return (
    <Link
      href={href}
      target={tool.isExternal ? '_blank' : undefined}
      className="block bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${cat?.color || 'bg-gray-100'} flex items-center justify-center text-xl shrink-0`}>
          {tool.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-base mb-1 dark:text-white">{tool.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
          <div className="mt-2 flex gap-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${cat?.color}`}>{cat?.name}</span>
            {tool.isHot && <span className="text-xs px-2 py-0.5 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full">HOT</span>}
            {tool.isNew && <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 rounded-full">NEW</span>}
            {tool.isExternal && <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">External</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
