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
    <ToolLayout tool={tool}>
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
