'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface Props {
  title: string;
  text: string;
}

export function ShareButtons({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = `https://barodogu.com${window.location.pathname}${window.location.search}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // SPA 네비게이션 시 스크립트가 이미 로드된 상태면 수동으로 재초기화
    if (typeof window !== 'undefined' && (window as unknown as { a2a?: { init_all: () => void } }).a2a) {
      (window as unknown as { a2a: { init_all: () => void } }).a2a.init_all();
    }
  }, []);

  const handleScriptLoad = () => {
    if (typeof window !== 'undefined' && (window as unknown as { a2a?: { init_all: () => void } }).a2a) {
      (window as unknown as { a2a: { init_all: () => void } }).a2a.init_all();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 my-4">
      <button
        onClick={copyLink}
        className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition dark:text-gray-300"
      >
        {copied ? '✓ 복사됨!' : '링크 복사'}
      </button>
      <div
        className="a2a_kit a2a_kit_size_32 a2a_default_style"
        data-a2a-title={`${title} - 바로도구`}
      >
        <a className="a2a_dd" href="https://www.addtoany.com/share" />
        <a className="a2a_button_line" />
        <a className="a2a_button_facebook" />
        <a className="a2a_button_telegram" />
        <a className="a2a_button_x" />
        <a className="a2a_button_linkedin" />
      </div>
      <Script
        src="https://static.addtoany.com/menu/page.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
    </div>
  );
}
