'use client';

import { useState } from 'react';

interface Props {
  title: string;
  text: string;
}

const BASE_URL = 'https://barodogu.com';

export function ShareButtons({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const getCanonicalUrl = () => {
    // 정식 도메인 URL + 쿼리 파라미터 포함 (결과 공유용)
    const path = window.location.pathname;
    const search = window.location.search;
    return `${BASE_URL}${path}${search}`;
  };

  const copyLink = async () => {
    const url = getCanonicalUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const url = encodeURIComponent(getCanonicalUrl());
    const t = encodeURIComponent(`${title} - 바로도구`);
    window.open(`https://twitter.com/intent/tweet?text=${t}&url=${url}`, '_blank');
  };

  return (
    <div className="flex gap-2 justify-center my-4">
      <button
        onClick={copyLink}
        className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition dark:text-gray-300"
      >
        {copied ? '복사됨!' : '링크 복사'}
      </button>
      <button
        onClick={shareTwitter}
        className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition dark:text-gray-300"
      >
        트위터 공유
      </button>
    </div>
  );
}
