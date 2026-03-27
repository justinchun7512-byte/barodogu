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
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">글자수 세기란?</h2>
            <p>글자수 세기는 입력한 텍스트의 글자수(공백 포함/제외), 바이트 수, 단어 수, 줄 수, 문장 수 등을 실시간으로 계산해주는 온라인 도구입니다. 자기소개서, 이력서, 블로그 글, SNS 게시물 등 글자수 제한이 있는 콘텐츠를 작성할 때 필수적으로 사용됩니다. 한글, 영문, 숫자, 특수문자를 모두 정확하게 카운트하며, UTF-8 바이트 수까지 확인할 수 있어 다양한 플랫폼의 글자수 기준에 대응할 수 있습니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>텍스트 입력란에 글자수를 세고 싶은 텍스트를 직접 입력하거나 붙여넣기 합니다.</li>
              <li>입력 즉시 상단에 공백 포함/제외 글자수, 바이트, 단어수가 실시간으로 표시됩니다.</li>
              <li>필요한 경우 글자수 제한을 설정하면 프로그레스 바로 현재 사용량을 시각적으로 확인할 수 있습니다.</li>
              <li>하단의 상세 정보에서 줄 수, 문장 수, 한글/영문 비율까지 확인할 수 있습니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">자기소개서 글자수는 공백 포함인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">대부분의 기업 채용 사이트에서는 &quot;공백 포함&quot; 기준으로 글자수를 계산합니다. 다만, 일부 기업은 공백 제외 기준을 사용하므로 채용공고를 반드시 확인하세요. 일반적으로 500자, 800자, 1000자 제한이 많습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">바이트 수는 왜 다른가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">한글은 UTF-8 기준으로 한 글자당 3바이트를 차지하고, 영문이나 숫자는 1바이트입니다. 일부 시스템(SMS, 데이터베이스 등)은 바이트 기준으로 제한하므로, 한글이 포함된 텍스트는 글자수보다 바이트 수가 훨씬 클 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">트위터(X) 글자수 제한은 몇 자인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">트위터(X)의 기본 글자수 제한은 280자(한글 기준 약 140자)입니다. 한글은 2자로 카운트되는 특수한 계산 방식을 사용합니다. 정확한 확인은 본 도구의 글자수 세기 기능을 활용하세요.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">줄바꿈도 글자수에 포함되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 줄바꿈(엔터)도 일반적으로 1자로 카운트됩니다. 공백 포함 글자수에는 줄바꿈이 포함되며, 공백 제외 글자수에서는 제외됩니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>자기소개서 작성 시 기업마다 정해진 글자수 제한을 지키는 것은 매우 중요합니다. 글자수가 초과되면 지원 자체가 불가능할 수 있고, 너무 적으면 성의 없어 보일 수 있습니다. 일반적으로 제한의 80~100%를 채우는 것이 적절합니다. 블로그 SEO를 위해서는 본문 글자수가 최소 1000자 이상인 것이 권장되며, 인스타그램 캡션은 2200자, 유튜브 설명란은 5000자까지 작성 가능합니다.</p>
          </div>
        </section>
      } guideContent={
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
