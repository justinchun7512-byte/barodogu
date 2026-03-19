'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('spell-checker')!;

export default function SpellCheckerPage() {
  const [text, setText] = useState('');
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheck = async () => {
    if (!text.trim()) return;
    setChecking(true);
    setMessage('');

    try {
      const res = await fetch('/api/spell-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500) }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      if (data.corrections && data.corrections.length > 0) {
        setMessage(`${data.corrections.length}개의 교정 제안이 있습니다:\n${data.corrections.map((c: { original: string; corrected: string }) => `• "${c.original}" → "${c.corrected}"`).join('\n')}`);
      } else {
        setMessage('맞춤법 오류가 발견되지 않았습니다.');
      }
    } catch {
      setMessage('맞춤법 검사 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        maxLength={500}
        placeholder="맞춤법을 검사할 텍스트를 입력하세요 (최대 500자)"
        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-primary text-base leading-relaxed mb-2"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-400">{text.length}/500자</span>
        <button
          onClick={handleCheck}
          disabled={checking || !text.trim()}
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-medium rounded-xl transition"
        >
          {checking ? '검사 중...' : '맞춤법 검사'}
        </button>
      </div>

      {message && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 whitespace-pre-line text-sm dark:text-gray-300">
          {message}
        </div>
      )}
    </ToolLayout>
  );
}
