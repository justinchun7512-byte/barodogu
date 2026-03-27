'use client';

import { useState } from 'react';
import { TOOLS, searchTools, getToolsByCategory, type Category } from '@/lib/tools';
import { CategoryFilter } from '@/components/tools/CategoryFilter';
import { ToolGrid } from '@/components/tools/ToolGrid';

export default function HomePage() {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const tools = search ? searchTools(search) : getToolsByCategory(category);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          회원가입 없이 <span className="text-primary">바로 쓰는</span> 무료 도구
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
          연봉 계산기부터 AI 핵심역량 추출기까지, 취업 준비에 필요한 모든 도구
        </p>
        <div className="flex justify-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <span className="text-green-500">&#10003;</span> 100% 무료
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <span className="text-green-500">&#10003;</span> 회원가입 X
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <span className="text-green-500">&#10003;</span> 브라우저 처리
          </span>
        </div>
      </section>

      {/* Mobile Search */}
      <div className="md:hidden mb-6">
        <input
          type="text"
          placeholder="도구 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Category Filter */}
      {!search && <CategoryFilter active={category} onChange={setCategory} />}

      {/* Tool Grid */}
      <section className="mb-12">
        {search && (
          <p className="text-sm text-gray-500 mb-4">
            &quot;{search}&quot; 검색 결과: {tools.length}개
          </p>
        )}
        <ToolGrid tools={tools} />
      </section>

      {/* Trust Banner */}
      <section className="mb-12 bg-primary/5 dark:bg-primary/10 rounded-xl p-6 text-center">
        <p className="text-primary font-medium mb-2">모든 처리는 브라우저에서 이루어집니다</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">파일이 서버로 전송되지 않아 안전합니다. 회원가입도 필요 없습니다.</p>
      </section>
    </main>
  );
}
