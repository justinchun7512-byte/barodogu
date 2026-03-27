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
        setMessage(`${data.corrections.length}개의 교정 제안이 있습니다:\n\n${data.corrections.map((c: { original: string; corrected: string; reason?: string }) => `• "${c.original}" → "${c.corrected}"${c.reason ? `\n  └ ${c.reason}` : ''}`).join('\n\n')}`);
      } else {
        setMessage('맞춤법 오류가 발견되지 않았습니다. 👍');
      }
    } catch {
      setMessage('맞춤법 검사 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">맞춤법 검사기란?</h2>
            <p>맞춤법 검사기는 입력한 한국어 텍스트의 맞춤법, 띄어쓰기, 표준어 사용 등을 AI가 자동으로 검사하고 교정 제안을 해주는 온라인 도구입니다. 자기소개서, 이력서, 보고서, 이메일, 블로그 글 등 중요한 문서를 작성할 때 맞춤법 실수를 방지하는 데 유용합니다. 최대 2,000자까지 검사할 수 있으며, 틀린 부분과 올바른 표현, 교정 이유까지 상세하게 안내합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>텍스트 입력란에 맞춤법을 검사할 문장을 입력하거나 붙여넣기 합니다. (최대 2,000자)</li>
              <li>&quot;맞춤법 검사&quot; 버튼을 클릭합니다.</li>
              <li>AI가 분석한 교정 제안이 목록으로 표시됩니다.</li>
              <li>각 교정 항목에서 원래 표현, 수정 표현, 교정 이유를 확인할 수 있습니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">자주 틀리는 맞춤법에는 어떤 것이 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">대표적으로 &quot;되/돼&quot;, &quot;~로서/~로써&quot;, &quot;왠지/웬지&quot;, &quot;안 되다/안되다&quot;, &quot;~데/~대&quot; 등이 있습니다. 이러한 표현들은 비슷해 보이지만 의미와 용법이 다르므로 주의가 필요합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">띄어쓰기도 검사되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">네, 본 맞춤법 검사기는 띄어쓰기 오류도 감지합니다. 한국어 띄어쓰기는 조사, 의존명사, 보조용언 등에서 자주 혼동이 생기는데, 이러한 부분도 교정 제안에 포함됩니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">검사할 수 있는 최대 글자수는?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">현재 한 번에 최대 2,000자까지 검사할 수 있습니다. 긴 문서의 경우 단락별로 나누어 검사하시면 됩니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">입력한 텍스트가 저장되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">검사를 위해 서버로 텍스트가 전송되지만, 검사 후 별도로 저장하거나 보관하지 않습니다. 개인정보가 포함된 문서도 안심하고 사용하실 수 있습니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>한국어 맞춤법은 국립국어원의 한글 맞춤법 규정을 기준으로 합니다. 표준국어대사전에서 올바른 표기법을 확인할 수 있으며, 국립국어원 온라인 가나다에서 맞춤법 관련 질의응답을 검색할 수도 있습니다. 특히 취업 서류(자기소개서, 이력서)의 맞춤법 오류는 지원자의 꼼꼼함과 성의를 판단하는 기준이 될 수 있으므로, 제출 전 반드시 맞춤법 검사를 권장합니다.</p>
          </div>
        </section>
      }>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        maxLength={2000}
        placeholder="맞춤법을 검사할 텍스트를 입력하세요 (최대 2,000자)"
        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-primary text-base leading-relaxed mb-2"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-400">{text.length}/2,000자</span>
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
