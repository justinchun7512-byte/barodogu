import { Tool } from '@/lib/tools';
import { ToolCard } from './ToolCard';

interface Props {
  tools: Tool[];
}

export function ToolGrid({ tools }: Props) {
  if (tools.length === 0) {
    return <p className="text-center text-gray-400 py-12">검색 결과가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
