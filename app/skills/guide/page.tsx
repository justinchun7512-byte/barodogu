// /skills/guide — 바로스킬 설치 가이드
// Claude.ai / Claude Code / Codex CLI / Cursor

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '바로스킬 설치 가이드 — Claude · Codex · Cursor',
  description:
    '바로스킬에 등록된 AI 스킬을 Claude.ai, Claude Code, Codex CLI, Cursor에서 1-클릭으로 추가하는 방법을 안내합니다.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function SkillGuidePage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <header>
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <Link href="/skills" className="hover:underline">
            바로스킬
          </Link>{' '}
          / 설치 가이드
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          바로스킬 설치 가이드
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          바로스킬에 게시된 AI 스킬을 내가 쓰는 도구(Claude.ai · Claude Code ·
          Codex CLI · Cursor)에서 바로 활용하는 방법입니다.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">공통 사용 흐름</h2>
        <ol className="space-y-2 list-decimal list-inside text-stone-700 dark:text-stone-300">
          <li>바로스킬에서 사용할 스킬을 선택합니다.</li>
          <li>상세 페이지의 본문(시스템 프롬프트 또는 사용 예시)을 복사합니다.</li>
          <li>아래 도구별 안내대로 붙여넣어 실행합니다.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Claude.ai 웹</h2>
        <ol className="space-y-2 list-decimal list-inside text-stone-700 dark:text-stone-300">
          <li>
            새 프로젝트(또는 새 대화)를 만들고 <b>Custom Instructions</b>에
            복사한 스킬 본문을 붙여넣습니다.
          </li>
          <li>같은 대화에서 작업 요청을 입력하면 스킬이 적용된 결과가 나옵니다.</li>
          <li>
            반복 사용 시 프로젝트로 저장해두면 매번 붙여넣지 않아도 됩니다.
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Claude Code (CLI)</h2>
        <ol className="space-y-2 list-decimal list-inside text-stone-700 dark:text-stone-300">
          <li>
            프로젝트 루트에 <code>.claude/skills/&lt;skill-name&gt;.md</code>{' '}
            파일을 만들고 본문을 저장합니다.
          </li>
          <li>
            <code>/skill</code> 또는 자동 트리거 키워드로 호출됩니다 (스킬 본문
            상단 trigger 설정 참고).
          </li>
          <li>
            여러 스킬을 묶어서 쓰려면{' '}
            <code>.claude/CLAUDE.md</code>에 사용 규칙을 추가하세요.
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Codex CLI</h2>
        <ol className="space-y-2 list-decimal list-inside text-stone-700 dark:text-stone-300">
          <li>
            <code>codex</code> 실행 시{' '}
            <code>--system &quot;...&quot;</code> 옵션으로 본문을 시스템
            프롬프트로 전달합니다.
          </li>
          <li>
            긴 본문은 파일로 저장 후{' '}
            <code>--system-file ./skill.md</code> 형태로 불러옵니다.
          </li>
          <li>워크플로 자동화 시에는 ENV 또는 config로 묶어두면 편합니다.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Cursor</h2>
        <ol className="space-y-2 list-decimal list-inside text-stone-700 dark:text-stone-300">
          <li>
            <code>.cursor/rules/&lt;skill-name&gt;.mdc</code> 파일을 만들고
            본문을 붙여넣습니다.
          </li>
          <li>적용 범위(Always / Auto / Manual)를 스킬 성격에 맞게 설정합니다.</li>
          <li>저장 후 새 대화부터 자동 적용됩니다.</li>
        </ol>
      </section>

      <section className="space-y-3 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          호환 도구 표기 보는 법
        </h2>
        <p className="text-sm text-stone-700 dark:text-stone-300">
          각 스킬 카드 하단에 <b>Claude.ai · Claude Code · Codex CLI · Cursor</b>{' '}
          등 호환 도구가 표기되어 있습니다. 표기된 도구에 맞춰 위 안내대로
          붙여넣으면 됩니다.
        </p>
      </section>

      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-4">
        <Link
          href="/skills"
          className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          ← 바로스킬 홈으로
        </Link>
        <Link
          href="/skills/submit"
          className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          내가 만든 스킬 제출하기 →
        </Link>
      </div>
    </div>
  );
}
