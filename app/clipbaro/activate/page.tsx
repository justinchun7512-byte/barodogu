// 데스크톱 PyInstaller 버전 폐기(2026-04-13)와 함께 라이선스 발급 페이지도 중단했다.
// 외부 링크/즐겨찾기로 들어오는 사용자에게 무료 베타 운영 중임을 명확히 안내한다.

export const metadata = {
  title: '클립바로 라이선스 안내 | 바로도구',
  description:
    '클립바로는 현재 무료 베타로 운영 중이며, 라이선스 발급 페이지는 일시적으로 제공되지 않습니다.',
};

export default function ClipBaroActivatePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            클립바로
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            현재 무료 베타 운영 중입니다
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            클립바로는 정식 결제 시스템을 준비 중입니다.
            <br />
            라이선스 발급 페이지는 일시적으로 제공되지 않으며,
            <br />
            무료 베타 동안 별도 키 없이 사용할 수 있습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 md:p-8">
          <p className="text-sm font-semibold mb-3">베타 기간 안내</p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="shrink-0 text-primary">•</span>
              <span>모든 기능을 별도 라이선스 키 없이 사용할 수 있습니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 text-primary">•</span>
              <span>정식 출시 일정과 가격은 메일/공지로 별도 안내드릴 예정입니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 text-primary">•</span>
              <span>
                이전에 발급받으신 라이선스 키가 있다면 그대로 보관해두세요.
                정식 결제 전환 시 안내드립니다.
              </span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="/contact"
              className="flex-1 text-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors"
            >
              문의하기
            </a>
            <a
              href="/"
              className="flex-1 text-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary text-sm font-medium transition-colors"
            >
              바로도구 메인으로
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
