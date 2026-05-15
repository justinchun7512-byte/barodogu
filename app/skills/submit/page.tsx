// /skills/submit — 스킬 제출 안내
// 제출 양식 백엔드는 추후 추가, 우선 mailto 기반으로 404 해소

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '스킬 제출하기 — 바로스킬',
  description:
    '직접 만든 AI 스킬을 바로스킬에 등록하세요. 영업·마케팅·콘텐츠·기획·한국형 유틸리티 카테고리에 맞춰 제출 양식을 안내합니다.',
};

const MAIL_TO =
  'mailto:justinchun7512@gmail.com' +
  '?subject=' +
  encodeURIComponent('[바로스킬 제출] 스킬 이름') +
  '&body=' +
  encodeURIComponent(
    [
      '아래 항목을 채워서 보내주세요.',
      '',
      '1) 스킬 이름:',
      '2) 카테고리: (영업/세일즈 · 마케팅 · 콘텐츠/크리에이터 · 기획/분석 · 한국형 유틸리티)',
      '3) 한 줄 설명:',
      '4) 호환 도구: (Claude.ai / Claude Code / Codex CLI / Cursor 등)',
      '5) 사용 예시(2~3줄):',
      '6) 원본 링크 또는 본문:',
      '7) 라이선스: (MIT / CC-BY / 자체 등)',
      '8) 제출자(닉네임/연락처, 선택):',
      '',
      '— 검토 후 게시 여부와 함께 회신드립니다.',
    ].join('\n'),
  );

export default function SkillSubmitPage() {
  return (
    <div className="space-y-10 max-w-3xl">
      <header>
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <Link href="/skills" className="hover:underline">
            바로스킬
          </Link>{' '}
          / 제출
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          스킬 제출하기
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          직접 만든 AI 스킬을 바로스킬에 등록해 보세요. 검토 후 카테고리에
          맞춰 게시합니다.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          제출 절차
        </h2>
        <ol className="space-y-3 list-decimal list-inside text-stone-700 dark:text-stone-300">
          <li>아래 양식을 메일로 보내주세요 (가장 빠릅니다).</li>
          <li>운영자가 1~3일 안에 검토 후 회신합니다.</li>
          <li>승인 시 바로스킬에 게시되고, 제출자 닉네임을 표시합니다.</li>
        </ol>
      </section>

      <section className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
        <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          제출 양식 (메일 본문)
        </h2>
        <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
          <li>· 스킬 이름</li>
          <li>· 카테고리 (영업·마케팅·콘텐츠·기획·한국형 유틸리티)</li>
          <li>· 한 줄 설명</li>
          <li>· 호환 도구 (Claude.ai / Claude Code / Codex CLI / Cursor 등)</li>
          <li>· 사용 예시 (2~3줄)</li>
          <li>· 원본 링크 또는 본문</li>
          <li>· 라이선스 (MIT / CC-BY / 자체)</li>
          <li>· 제출자 (선택)</li>
        </ul>
        <div className="pt-2">
          <a
            href={MAIL_TO}
            className="inline-flex items-center px-4 py-2 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium hover:opacity-90"
          >
            메일로 제출하기 →
          </a>
        </div>
        <p className="text-xs text-stone-500">
          메일 앱이 열리지 않으면{' '}
          <a
            href="mailto:justinchun7512@gmail.com"
            className="underline hover:text-stone-900 dark:hover:text-stone-100"
          >
            justinchun7512@gmail.com
          </a>
          으로 직접 보내주세요.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
          심사 기준
        </h2>
        <ul className="space-y-2 text-stone-700 dark:text-stone-300 text-sm">
          <li>· 실제 직무에서 바로 쓸 수 있는가</li>
          <li>· 한국어 문맥에서 정확히 동작하는가</li>
          <li>· 출처·라이선스가 명확한가</li>
          <li>· 다른 스킬과 중복되지 않는가</li>
        </ul>
      </section>

      <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
        <Link
          href="/skills"
          className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          ← 바로스킬 홈으로
        </Link>
      </div>
    </div>
  );
}
