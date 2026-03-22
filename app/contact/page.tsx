import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '문의하기 - 바로도구',
  description: '바로도구에 대한 문의사항을 보내주세요.',
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">문의하기</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          바로도구 이용 중 궁금한 점이나 개선 제안, 오류 신고 등이 있으시면 아래 이메일로 연락해 주세요.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 dark:text-white">연락처</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">&#9993;</span>
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <a href="mailto:justinchun7512@gmail.com" className="text-primary hover:underline font-medium">justinchun7512@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 dark:text-white">문의 유형</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">&#8226;</span>
              <div>
                <p className="font-medium dark:text-white">기능 오류 신고</p>
                <p className="text-sm text-gray-500">계산 결과가 정확하지 않거나 도구가 작동하지 않는 경우</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">&#8226;</span>
              <div>
                <p className="font-medium dark:text-white">새로운 도구 제안</p>
                <p className="text-sm text-gray-500">추가되었으면 하는 도구나 기능이 있는 경우</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">&#8226;</span>
              <div>
                <p className="font-medium dark:text-white">제휴 / 협업 문의</p>
                <p className="text-sm text-gray-500">비즈니스 제안이나 협업 관련 문의</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">&#8226;</span>
              <div>
                <p className="font-medium dark:text-white">기타 문의</p>
                <p className="text-sm text-gray-500">그 외 궁금한 점이나 의견</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3 dark:text-white">운영 정보</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm space-y-1">
            <p><span className="text-gray-500">운영:</span> 내일모코퍼레이션</p>
            <p><span className="text-gray-500">사이트:</span> <Link href="/" className="text-primary hover:underline">barodogu.com</Link></p>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          보내주신 문의는 확인 후 최대한 빠르게 답변 드리겠습니다. 감사합니다.
        </p>
      </div>
    </main>
  );
}
