'use client';

import { useState } from 'react';
import { TOOLS, searchTools, getToolsByCategory, type Category } from '@/lib/tools';
import { CategoryFilter } from '@/components/tools/CategoryFilter';
import { ToolGrid } from '@/components/tools/ToolGrid';

export default function ToolsPageClient() {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const tools = search ? searchTools(search) : getToolsByCategory(category);
  const toolCount = TOOLS.length;

  return (
    <main className="max-w-[1100px] mx-auto px-5 md:px-10 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-[Outfit] text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1A2E] dark:text-[#E8E8F0] mb-3">
          전체 도구 모음
        </h1>
        <p className="text-[15px] text-gray-400 dark:text-gray-500">
          {toolCount}개 무료 도구를 회원가입 없이 바로 사용하세요
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="도구 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-3 rounded-xl border-[1.5px] border-[#E8EAF0] dark:border-[#2A2B35] bg-white dark:bg-[#1A1B23] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Category Filter */}
      {!search && <CategoryFilter active={category} onChange={setCategory} />}

      {/* Search results */}
      {search && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          &quot;{search}&quot; 검색 결과: {tools.length}개
        </p>
      )}

      {/* Tool Grid */}
      <ToolGrid tools={tools} />

      {/* Trust Banner */}
      <div className="mt-16 bg-primary/5 dark:bg-primary/10 rounded-xl p-6 text-center">
        <p className="text-primary font-medium mb-2">모든 처리는 브라우저에서 이루어집니다</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">파일이 서버로 전송되지 않아 안전합니다. 회원가입도 필요 없습니다.</p>
      </div>
    </main>
  );
}
