import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-semibold text-sm dark:text-white">바로도구</span>
            <span className="text-gray-400 text-sm">by 내일모코퍼레이션</span>
          </div>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">사이트 소개</Link>
            <Link href="/company" className="hover:text-gray-600 dark:hover:text-gray-300">회사 소개</Link>
            <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">문의하기</Link>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">&copy; 2026 내일모코퍼레이션. All rights reserved.</p>
      </div>
    </footer>
  );
}
