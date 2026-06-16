import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '클립바로 베타 신청',
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <Link href="/clipbaro" className="text-sm text-slate-500 hover:text-slate-700">
          ← 클립바로 홈
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">클립바로 베타</h1>
        <p className="mt-2 text-sm text-slate-600">
          현재 초대 전용 클로즈드 베타로 운영 중입니다.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">초대 코드가 필요합니다</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            클립바로는 현재 초대 코드를 받은 분들만 가입할 수 있습니다.
            정식 오픈 시 이메일로 안내드리겠습니다.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-left">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">베타 혜택</p>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>✓ 가입 즉시 무료 크레딧 5개 지급</li>
              <li>✓ AI 대본 + 이미지 + 음성 자동 생성</li>
              <li>✓ 유튜브 쇼츠 60초 완성본 다운로드</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/clipbaro/login" className="font-medium text-blue-600 hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
