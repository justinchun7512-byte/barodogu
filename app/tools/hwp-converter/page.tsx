import Link from 'next/link';
import { getToolById } from '@/lib/tools';
import { ToolLayout } from '@/components/layout/ToolLayout';

const tool = getToolById('hwp-converter')!;

export default function HwpConverterPage() {
  return (
    <ToolLayout tool={tool} seoContent={
        <section className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">HWP 변환이란?</h2>
            <p>HWP 변환 도구는 한글(HWP) 파일을 PDF, Word(DOCX), HTML 등 다양한 포맷으로 변환할 수 있는 온라인 도구입니다. HWP는 한글과컴퓨터에서 개발한 한국 고유의 문서 포맷으로, 관공서, 학교, 기업 등에서 널리 사용됩니다. 하지만 Mac이나 Linux 환경에서는 열기 어렵고, 해외 기업과의 문서 교환에도 불편합니다. HWP 변환기를 사용하면 이러한 호환성 문제를 해결할 수 있습니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">사용 방법</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>HWP 파일을 업로드합니다.</li>
              <li>변환할 포맷(PDF, DOCX, HTML)을 선택합니다.</li>
              <li>변환 버튼을 클릭하면 파일이 변환됩니다.</li>
              <li>변환된 파일을 다운로드합니다.</li>
            </ol>
            <p className="mt-2 text-primary font-medium">현재 개발 중이며, 곧 사용하실 수 있습니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">자주 묻는 질문</h2>
            <div className="space-y-2">
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">HWP 파일은 한글 프로그램 없이 열 수 없나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">HWP 파일은 기본적으로 한글 프로그램이 필요하지만, 한글뷰어(무료)를 설치하거나 네이버 오피스, 한컴오피스 온라인 등으로 열 수 있습니다. 본 도구를 이용하면 PDF나 DOCX로 변환하여 어떤 환경에서든 열 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">HWP를 PDF로 변환하면 레이아웃이 유지되나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">PDF 변환 시 원본 HWP 문서의 레이아웃, 글꼴, 이미지 등이 최대한 보존됩니다. 다만, 특수한 한글 기능(표, 수식 등)은 일부 차이가 있을 수 있습니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">HWPX 파일도 지원하나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">HWPX는 한글 2014 이후 도입된 새로운 포맷으로, 기존 HWP와 호환성을 유지하면서 국제 표준(OWPML)을 따릅니다. 본 도구는 HWP와 HWPX 모두 지원할 예정입니다.</p>
              </details>
              <details className="group border border-gray-200 dark:border-gray-600 rounded-lg">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 dark:text-gray-200 select-none">파일 크기 제한이 있나요?</summary>
                <p className="px-4 pb-3 text-gray-600 dark:text-gray-400">브라우저에서 처리하므로 대용량 파일의 경우 처리 시간이 길어질 수 있습니다. 일반적인 문서(10MB 이하)는 원활하게 변환됩니다.</p>
              </details>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">관련 정보</h2>
            <p>HWP(Hangul Word Processor)는 1989년 한글과컴퓨터에서 처음 출시된 이래, 한국에서 가장 널리 사용되는 문서 편집 프로그램 중 하나입니다. 특히 공공기관에서는 전자문서 표준 포맷으로 사용되어 왔으며, 최근에는 국제 호환성을 위해 ODF(Open Document Format)나 PDF 포맷 사용이 확대되고 있습니다. 취업 서류, 관공서 서류 등을 다룰 때 HWP 변환 도구는 필수적인 유틸리티입니다.</p>
          </div>
        </section>
      }>
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
