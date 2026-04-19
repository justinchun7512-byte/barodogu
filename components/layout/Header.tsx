'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toggleTheme } from './ThemeProvider';

export function Header() {
  const [search, setSearch] = useState('');

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#FAFBFF]/80 dark:bg-[#0F1117]/80 border-b border-[#E8EAF0] dark:border-[#2A2B35]"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0">
          <span className="font-[Outfit] font-bold text-[22px] tracking-tight text-[#1A1A2E] dark:text-[#E8E8F0]">
            baro<span className="text-primary">dogu</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#tools" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1A1A2E] dark:hover:text-white transition-colors">
            도구
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1A1A2E] dark:hover:text-white transition-colors">
            블로그
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1A1A2E] dark:hover:text-white transition-colors">
            소개
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <svg className="w-5 h-5 dark:hidden text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg className="w-5 h-5 hidden dark:block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <Link
            href="/#tools"
            className="hidden md:inline-flex bg-[#1A1A2E] dark:bg-white text-white dark:text-[#1A1A2E] px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#2A2A4E] dark:hover:bg-gray-200 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
