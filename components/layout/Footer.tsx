import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#E8EAF0] dark:border-[#2A2B35] mt-12 py-10 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 dark:text-gray-500 mb-3">
          <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">이용약관</Link>
          <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">개인정보처리방침</Link>
          <Link href="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">문의</Link>
          <Link href="/blog" className="hover:text-gray-600 dark:hover:text-gray-300">블로그</Link>
          <Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">사이트 소개</Link>
          <Link href="/company" className="hover:text-gray-600 dark:hover:text-gray-300">회사 소개</Link>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">&copy; 2026 내일모코퍼레이션. All rights reserved.</p>
      </div>
    </footer>
  );
}
