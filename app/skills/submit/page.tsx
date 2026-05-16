// /skills/submit — 스킬 제출 (Supabase 폼)
// 서버 컴포넌트 (metadata + 헤더) + <SubmitForm/> 클라이언트 컴포넌트

import Link from 'next/link';
import type { Metadata } from 'next';
import { SubmitForm } from './SubmitForm';

export const metadata: Metadata = {
  title: '스킬 제출하기 — 바로스킬',
  description:
    '직접 만든 AI 스킬을 바로스킬에 등록하세요. 카테고리·설명·호환 도구만 입력하면 운영자가 검토 후 게시합니다.',
};

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
          입력 후 제출하시면 운영자가 1~3일 안에 검토하고 게시합니다. 회원가입은
          필요 없습니다.
        </p>
      </header>

      <SubmitForm />

      <section className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
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

      <div>
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
