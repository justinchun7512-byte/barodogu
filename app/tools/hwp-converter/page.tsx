import Link from 'next/link';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('hwp-converter')!;

export default function HwpConverterPage() {
  return (
    <ToolLayout tool={tool}>
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-bold mb-2 dark:text-white">HWP 변환 도구 준비 중</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          한글(HWP) 파일을 PDF, Word로 변환하는 기능을 개발하고 있습니다.<br />
          곧 사용하실 수 있습니다!
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 max-w-md mx-auto text-left text-sm space-y-2">
          <p className="font-medium dark:text-white">예정 기능:</p>
          <ul className="text-gray-500 dark:text-gray-400 space-y-1">
            <li>- HWP → PDF 변환</li>
            <li>- HWP → Word (DOCX) 변환</li>
            <li>- HWP → HTML 변환</li>
            <li>- 브라우저 처리 (파일 서버 전송 없음)</li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3">다른 도구를 먼저 사용해보세요</p>
          <div className="flex gap-3 justify-center">
            <Link href="/tools/pdf-to-image" className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition">
              PDF → 이미지 변환
            </Link>
            <Link href="/tools/image-converter" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              이미지 포맷 변환
            </Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
