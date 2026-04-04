'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOOLS, searchTools, getToolsByCategory, getToolById, type Category } from '@/lib/tools';
import { CategoryFilter } from '@/components/tools/CategoryFilter';
import { ToolGrid } from '@/components/tools/ToolGrid';

const POPULAR_TOOL_IDS = ['salary-calculator', 'bmi-calculator', 'name-compatibility', 'severance-calculator'];

export default function HomePage() {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const tools = search ? searchTools(search) : getToolsByCategory(category);
  const toolCount = TOOLS.length;

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center px-5 md:px-10 pt-12 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse,_rgba(91,107,240,0.08)_0%,_rgba(232,244,253,0.12)_40%,_transparent_70%)] dark:bg-[radial-gradient(ellipse,_rgba(91,107,240,0.15)_0%,_rgba(91,107,240,0.05)_40%,_transparent_70%)] pointer-events-none" />

        {/* Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/15 dark:border-primary/25 px-4 py-1.5 rounded-full text-[13px] text-primary font-medium mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {toolCount}개 무료 도구 운영 중
        </div>

        {/* Title */}
        <h1 className="relative z-10 font-[Outfit] text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#1A1A2E] dark:text-[#E8E8F0] mb-5">
          취업 준비,<br />
          <span className="relative inline-block">
            바로 시작하세요
            <span className="absolute bottom-1 left-[-4px] right-[-4px] h-4 bg-gradient-to-r from-primary/20 to-[#00BCD4]/30 dark:from-primary/30 dark:to-[#00BCD4]/40 rounded z-[-1]" />
          </span>
        </h1>

        {/* Description */}
        <p className="relative z-10 text-[17px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-9">
          회원가입 없이, 비용 없이, 브라우저에서 바로.<br />
          AI가 분석하고, 도구가 계산합니다.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 flex gap-3 justify-center flex-wrap">
          <a
            href="#tools"
            className="bg-[#1A1A2E] dark:bg-white text-white dark:text-[#1A1A2E] px-8 py-3.5 rounded-xl text-[15px] font-semibold shadow-[0_4px_16px_rgba(26,26,46,0.12)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(26,26,46,0.18)] transition-all"
          >
            도구 둘러보기
          </a>
          <a
            href="/blog"
            className="bg-white dark:bg-[#1A1B23] border-[1.5px] border-[#E0E2EA] dark:border-[#2A2B35] text-gray-600 dark:text-gray-300 px-8 py-3.5 rounded-xl text-[15px] font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all"
          >
            블로그 읽기
          </a>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 flex justify-center mt-12 bg-[#E8EAF0] dark:bg-[#2A2B35] rounded-2xl overflow-hidden max-w-[600px] w-full gap-px mx-auto">
          <div className="flex-1 bg-white dark:bg-[#1A1B23] py-5 px-6 text-center">
            <div className="font-[Outfit] text-3xl font-bold text-[#1A1A2E] dark:text-[#E8E8F0]">{toolCount}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">무료 도구</div>
          </div>
          <div className="flex-1 bg-white dark:bg-[#1A1B23] py-5 px-6 text-center">
            <div className="font-[Outfit] text-3xl font-bold text-[#1A1A2E] dark:text-[#E8E8F0]">0원</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">이용 비용</div>
          </div>
          <div className="flex-1 bg-white dark:bg-[#1A1B23] py-5 px-6 text-center">
            <div className="font-[Outfit] text-3xl font-bold text-[#1A1A2E] dark:text-[#E8E8F0]">100%</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">브라우저 처리</div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 pt-12 pb-4">
        <h2 className="font-[Outfit] text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-[#E8E8F0] mb-2">인기 도구</h2>
        <p className="text-[15px] text-gray-400 dark:text-gray-500 mb-6">가장 많이 사용하는 도구를 바로 시작하세요</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {POPULAR_TOOL_IDS.map(id => {
            const t = getToolById(id);
            if (!t) return null;
            return (
              <Link
                key={t.id}
                href={`/tools/${t.id}`}
                className="group flex flex-col items-center gap-2 bg-white dark:bg-[#1A1B23] rounded-2xl p-5 border-[1.5px] border-[#E8EAF0] dark:border-[#2A2B35] hover:border-primary/25 dark:hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(91,107,240,0.06)] transition-all duration-250 text-center"
              >
                <span className="text-3xl mb-1">{t.icon}</span>
                <span className="font-bold text-sm text-[#1A1A2E] dark:text-[#E8E8F0]">{t.name}</span>
                <span className="text-[12px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">{t.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 py-20" id="tools">
        <div className="flex justify-between items-center mb-9">
          <div>
            <h2 className="font-[Outfit] text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-[#E8E8F0]">도구 모음</h2>
            <p className="text-[15px] text-gray-400 dark:text-gray-500 mt-1">필요한 도구를 선택하세요</p>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <input
            type="text"
            placeholder="도구 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-[#E8EAF0] dark:border-[#2A2B35] bg-white dark:bg-[#1A1B23] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Category Filter */}
        {!search && <CategoryFilter active={category} onChange={setCategory} />}

        {/* Search results */}
        {search && (
          <p className="text-sm text-gray-500 mb-4">
            &quot;{search}&quot; 검색 결과: {tools.length}개
          </p>
        )}

        {/* Tool Grid */}
        <ToolGrid tools={tools} />
      </section>

      {/* Trust Banner */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 mb-12">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 text-center">
          <p className="text-primary font-medium mb-2">모든 처리는 브라우저에서 이루어집니다</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">파일이 서버로 전송되지 않아 안전합니다. 회원가입도 필요 없습니다.</p>
        </div>
      </section>
    </main>
  );
}
