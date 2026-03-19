'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { countCharacters } from '@/lib/calculators/character-counter';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('character-counter')!;

export default function CharacterCounterPage() {
  const [text, setText] = useState('');
  const [limit, setLimit] = useState<number | null>(null);
  const result = countCharacters(text);
  const overLimit = limit !== null && result.charWithSpace > limit;

  return (
    <ToolLayout tool={tool} guideContent={
      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white">글자수 세기 FAQ</h2>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">자기소개서 글자수 기준은?</h3><p>대부분의 기업은 &quot;공백 포함&quot; 기준으로 글자수를 제한합니다. 보통 500자, 800자, 1000자가 일반적입니다.</p></div>
          <div><h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">바이트 계산은 왜 필요한가요?</h3><p>일부 시스템은 바이트 기준으로 제한합니다. 한글은 UTF-8 기준 3바이트, 영문은 1바이트입니다.</p></div>
        </div>
      </div>
    }>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: '글자수 (공백 포함)', value: result.charWithSpace, primary: true },
          { label: '글자수 (공백 제외)', value: result.charNoSpace },
          { label: '바이트 (UTF-8)', value: result.bytes },
          { label: '단어수', value: result.words },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold ${s.primary ? 'text-primary' : 'dark:text-white'}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Limit Bar */}
      {limit !== null && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">글자수 제한</span>
            <span><span className={`font-bold ${overLimit ? 'text-red-500' : 'text-primary'}`}>{result.charWithSpace.toLocaleString()}</span> / {limit.toLocaleString()}자</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${overLimit ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min((result.charWithSpace / limit) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="여기에 텍스트를 입력하세요...&#10;&#10;자소서, 이력서, 블로그 글 등을 붙여넣기 해보세요."
        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-primary text-base leading-relaxed mb-4"
      />

      {/* Options */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">글자수 제한:</label>
          <input type="number" min="1" placeholder="없음" onChange={(e) => setLimit(e.target.value ? parseInt(e.target.value) : null)} className="w-20 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-primary" />
          <span className="text-sm text-gray-400">자</span>
        </div>
        <button onClick={() => setText('')} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">지우기</button>
        <button onClick={() => navigator.clipboard.writeText(text)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">복사</button>
      </div>

      {/* Detail Stats */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">상세 정보</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-500">줄 수</span><br /><span className="font-semibold dark:text-white">{result.lines}</span></div>
          <div><span className="text-gray-500">문장 수</span><br /><span className="font-semibold dark:text-white">{result.sentences}</span></div>
          <div><span className="text-gray-500">한글</span><br /><span className="font-semibold dark:text-white">{result.korean}</span></div>
          <div><span className="text-gray-500">영문</span><br /><span className="font-semibold dark:text-white">{result.english}</span></div>
        </div>
      </div>
    </ToolLayout>
  );
}
