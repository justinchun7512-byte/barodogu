'use client';

import { useState } from 'react';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('json-formatter')!;

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');

  let formatted = '';
  let isValid = false;

  if (input.trim()) {
    try {
      const parsed = JSON.parse(input);
      formatted = JSON.stringify(parsed, null, indent);
      isValid = true;
      if (error) setError('');
    } catch (e) {
      formatted = input;
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
  };

  const handleSample = () => {
    setInput(JSON.stringify({
      name: "바로도구",
      version: "1.0.0",
      tools: [
        { id: "salary-calculator", category: "employment" },
        { id: "image-converter", category: "image" }
      ],
      config: { darkMode: true, language: "ko" }
    }, null, 2));
    setError('');
  };

  return (
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">JSON 포맷터/뷰어란?</h2>
            <p>JSON 포맷터/뷰어는 JSON(JavaScript Object Notation) 데이터를 보기 좋게 정렬(포맷팅)하거나 압축(Minify)하고, 유효성을 검사해주는 온라인 개발 도구입니다. API 응답 데이터 확인, 설정 파일 편집, 데이터 디버깅 등 개발 과정에서 자주 사용됩니다. 들여쓰기(2칸, 4칸, 탭)를 선택하여 깔끔하게 정렬할 수 있으며, 실시간으로 JSON 문법 오류를 감지하여 알려줍니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>텍스트 입력란에 JSON 데이터를 입력하거나 붙여넣기 합니다.</li>
              <li>&quot;정렬&quot; 버튼을 클릭하면 선택한 들여쓰기 기준으로 보기 좋게 포맷팅됩니다.</li>
              <li>&quot;압축&quot; 버튼을 클릭하면 공백과 줄바꿈을 제거한 최소 크기의 JSON으로 변환됩니다.</li>
              <li>상단의 Valid/Invalid 배지로 JSON 문법의 유효성을 실시간 확인할 수 있습니다.</li>
              <li>&quot;샘플&quot; 버튼으로 예시 JSON을 불러와 테스트할 수 있습니다.</li>
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">JSON이란 무엇인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">JSON(JavaScript Object Notation)은 데이터를 저장하고 전송하기 위한 경량 데이터 형식입니다. 사람이 읽기 쉽고, 대부분의 프로그래밍 언어에서 지원하여 웹 API, 설정 파일, 데이터 교환 등에 널리 사용됩니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">JSON 문법 오류의 흔한 원인은 무엇인가요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">가장 흔한 오류로는 마지막 항목 뒤의 불필요한 쉼표(trailing comma), 키에 따옴표 누락, 작은따옴표 사용(JSON은 큰따옴표만 허용), 주석 포함(JSON은 주석을 지원하지 않음) 등이 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">Minify(압축)는 왜 사용하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">JSON을 Minify하면 불필요한 공백과 줄바꿈이 제거되어 파일 크기가 줄어듭니다. API 통신 시 데이터 전송량을 줄이거나, 설정 파일의 크기를 최소화할 때 유용합니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">입력한 JSON 데이터가 저장되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">아닙니다. 모든 JSON 처리는 사용자의 브라우저에서 이루어집니다. 입력한 데이터가 서버로 전송되거나 저장되지 않으므로, 민감한 데이터도 안심하고 사용하실 수 있습니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>JSON은 2001년 Douglas Crockford에 의해 제안되었으며, 현재 웹 개발에서 가장 널리 사용되는 데이터 교환 형식입니다. REST API의 표준 응답 형식으로 자리잡았으며, MongoDB 등 NoSQL 데이터베이스에서도 데이터 저장 형식으로 사용됩니다. JSON의 대안으로는 XML, YAML, Protocol Buffers 등이 있으며, 각각 장단점이 있습니다. 개발 생산성을 높이기 위해 JSON 포맷터는 필수 개발 도구 중 하나입니다.</p>
          </div>
        </section>
      }>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={handleFormat} className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition">정렬</button>
        <button onClick={handleMinify} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm rounded-lg transition dark:text-gray-300">압축 (Minify)</button>
        <button onClick={handleCopy} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm rounded-lg transition dark:text-gray-300">복사</button>
        <button onClick={() => { setInput(''); setError(''); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm rounded-lg transition dark:text-gray-300">초기화</button>
        <button onClick={handleSample} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm rounded-lg transition dark:text-gray-300">샘플</button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-gray-500">들여쓰기:</label>
          <select value={indent} onChange={e => setIndent(parseInt(e.target.value))} className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg">
            <option value={2}>2칸</option>
            <option value={4}>4칸</option>
            <option value={8}>Tab</option>
          </select>
        </div>
      </div>

      {/* Validation Badge */}
      {input.trim() && (
        <div className={`mb-3 px-3 py-1.5 rounded-lg text-xs font-medium inline-block ${isValid ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
          {isValid ? 'Valid JSON' : `Invalid: ${error}`}
        </div>
      )}

      {/* Editor */}
      <textarea
        value={input}
        onChange={e => { setInput(e.target.value); setError(''); }}
        rows={18}
        placeholder='{"name": "바로도구", "version": "1.0"}'
        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-green-400 resize-y focus:outline-none focus:ring-2 focus:ring-primary text-sm leading-relaxed font-mono"
        spellCheck={false}
      />

      {/* Stats */}
      {input.trim() && (
        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          <span>{input.length.toLocaleString()} chars</span>
          <span>{new Blob([input]).size.toLocaleString()} bytes</span>
          <span>{input.split('\n').length} lines</span>
        </div>
      )}
    </ToolLayout>
  );
}
