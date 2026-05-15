'use client';

// 스킬을 사용자 환경에 추가하는 가이드 모달 — 가장 중요한 UX 컴포넌트
// 환경별 (Claude.ai, Claude Code, Codex CLI) 설치 방법을 탭으로 안내
// 패치 반영: zipUrl 이 null 이면 트리거 버튼 비활성 ("준비 중")

import { useState } from 'react';
import type { Skill } from '@/types/skills';

interface Props {
  skill: Skill;
  zipUrl: string | null;
}

type TabKey = 'claude-ai' | 'claude-code' | 'codex-cli';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'claude-ai', label: 'Claude.ai (웹·앱)' },
  { key: 'claude-code', label: 'Claude Code' },
  { key: 'codex-cli', label: 'Codex CLI' },
];

export function InstallModal({ skill, zipUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('claude-ai');
  const [copied, setCopied] = useState(false);

  const ready = !!zipUrl;
  const claudeCodeCmd = ready
    ? `mkdir -p ~/.claude/skills/${skill.slug} && cd ~/.claude/skills/${skill.slug} && curl -OL ${zipUrl} && unzip -o ${skill.slug}.zip`
    : '';
  const codexCmd = ready
    ? `mkdir -p ~/.codex/skills/${skill.slug} && cd ~/.codex/skills/${skill.slug} && curl -OL ${zipUrl} && unzip -o ${skill.slug}.zip`
    : '';

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => ready && setOpen(true)}
          disabled={!ready}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          aria-disabled={!ready}
        >
          {ready ? '내 환경에 추가하기' : '준비 중'}
        </button>
        {ready && (
          <a
            href={zipUrl}
            download={`${skill.slug}.zip`}
            className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 font-medium hover:border-stone-500 dark:hover:border-stone-400 transition-colors"
          >
            zip 다운로드
          </a>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-stone-500 mr-1">설치:</span>
                {skill.name_ko}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 -mt-1 -mr-1 p-1"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-stone-500 mb-5">
              사용 중인 환경을 선택하세요.
            </p>

            <div className="flex gap-1 border-b border-stone-200 dark:border-stone-800 mb-5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    tab === t.key
                      ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100'
                      : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'claude-ai' && (
              <ol className="space-y-3 text-sm leading-relaxed">
                <li>
                  <span className="font-semibold">1.</span> 우측 상단의{' '}
                  <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-xs">
                    zip 다운로드
                  </code>{' '}
                  버튼을 눌러 파일을 받으세요.
                </li>
                <li>
                  <span className="font-semibold">2.</span> Claude.ai (또는
                  데스크탑 앱)에서{' '}
                  <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-xs">
                    설정 → 기능 → 스킬
                  </code>{' '}
                  로 이동합니다.
                </li>
                <li>
                  <span className="font-semibold">3.</span> "스킬 업로드" 버튼을
                  클릭하고 방금 받은 zip 파일을 선택합니다.
                </li>
                <li>
                  <span className="font-semibold">4.</span> 채팅에서 자연스럽게
                  요청하면 Claude 가 스킬을 자동으로 사용합니다.
                </li>
              </ol>
            )}

            {tab === 'claude-code' && (
              <CommandBlock
                description="터미널에서 다음 한 줄을 실행:"
                command={claudeCodeCmd}
                hint="설치 후 새 `claude` 세션을 시작하면 자동 로딩됩니다."
                onCopy={copy}
                copied={copied}
              />
            )}

            {tab === 'codex-cli' && (
              <CommandBlock
                description="터미널에서 다음 한 줄을 실행:"
                command={codexCmd}
                hint="설치 후 `codex` 새 세션에서 스킬이 인식됩니다."
                onCopy={copy}
                copied={copied}
              />
            )}

            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500">
              문제가 있나요? 다른 도구를 쓰시나요?{' '}
              <a href="/skills/guide" className="underline">
                전체 설치 가이드 보기
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CommandBlock({
  description,
  command,
  hint,
  onCopy,
  copied,
}: {
  description: string;
  command: string;
  hint: string;
  onCopy: (s: string) => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm">{description}</p>
      <div className="relative">
        <pre className="text-xs p-3 pr-20 rounded-lg bg-stone-950 text-stone-100 overflow-auto whitespace-pre-wrap break-all">
          {command}
        </pre>
        <button
          onClick={() => onCopy(command)}
          className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-stone-800 text-stone-100 hover:bg-stone-700"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <p className="text-xs text-stone-500">{hint}</p>
    </div>
  );
}
