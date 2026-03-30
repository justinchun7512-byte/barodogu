import Link from 'next/link';
import { Tool, getCategoryInfo } from '@/lib/tools';

export function ToolCard({ tool }: { tool: Tool }) {
  const cat = getCategoryInfo(tool.category);
  const href = tool.isExternal ? tool.externalUrl! : `/tools/${tool.id}`;

  // Badge style
  const badgeClass = tool.isHot
    ? 'bg-[#FFF0EB] text-[#E8590C] dark:bg-[#E8590C]/15 dark:text-[#FF8A65]'
    : tool.isNew
    ? 'bg-[#F0F1FF] text-[#5B6BF0] dark:bg-[#5B6BF0]/15 dark:text-[#8B96FF]'
    : '';

  const badgeLabel = tool.isHot ? 'HOT' : tool.isNew ? 'NEW' : '';

  // Check if AI tool
  const isAI = tool.category === 'ai' || tool.tags.includes('AI');
  const aiBadge = isAI && !tool.isHot && !tool.isNew;

  return (
    <Link
      href={href}
      target={tool.isExternal ? '_blank' : undefined}
      className="group block bg-white dark:bg-[#1A1B23] rounded-2xl p-6 border-[1.5px] border-[#E8EAF0] dark:border-[#2A2B35] hover:border-primary/25 dark:hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(91,107,240,0.06)] dark:hover:shadow-[0_12px_40px_rgba(91,107,240,0.15)] transition-all duration-250"
    >
      <div className="flex items-start justify-between mb-3.5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F0F1FF] to-[#E8F4FD] dark:from-[#2A2B45] dark:to-[#1A2A35] flex items-center justify-center text-[22px] shrink-0">
          {tool.icon}
        </div>
        {badgeLabel && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide ${badgeClass}`}>
            {badgeLabel}
          </span>
        )}
        {aiBadge && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide bg-[#E8F4FD] text-[#0891B2] dark:bg-[#0891B2]/15 dark:text-[#22D3EE]">
            AI
          </span>
        )}
      </div>

      <h3 className="font-bold text-base mb-1.5 text-[#1A1A2E] dark:text-[#E8E8F0]">{tool.name}</h3>
      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{tool.description}</p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0F1F5] dark:border-[#2A2B35]">
        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{cat?.name}</span>
        <div className="w-7 h-7 rounded-lg bg-[#F5F6FA] dark:bg-[#2A2B35] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 group-hover:bg-primary group-hover:text-white transition-all">
          &rarr;
        </div>
      </div>
    </Link>
  );
}
