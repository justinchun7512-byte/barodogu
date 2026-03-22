import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '사이트 소개 - 바로도구',
  description: '바로도구는 회원가입 없이 바로 사용할 수 있는 무료 온라인 유틸리티 도구 모음입니다.',
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">사이트 소개</h1>

      <section className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">바로도구란?</h2>
          <p>
            바로도구는 연봉 실수령액, 퇴직금, 실업급여, 대출이자, 글자수 세기 등
            일상 생활과 취업 준비에 자주 필요한 계산과 도구를 빠르고 정확하게 제공하는
            <strong> 무료 온라인 유틸리티 서비스</strong>입니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">특징</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>100% 무료</strong> - 모든 도구를 무료로 제한 없이 사용할 수 있습니다.</li>
            <li><strong>회원가입 불필요</strong> - 별도의 가입 없이 바로 사용 가능합니다.</li>
            <li><strong>최신 세율 및 요율 반영</strong> - 2026년 기준 4대보험, 소득세, 최저시급 등을 반영합니다.</li>
            <li><strong>모바일 최적화</strong> - 스마트폰, 태블릿, PC 어디서든 편리하게 사용할 수 있습니다.</li>
            <li><strong>개인정보 보호</strong> - 입력하신 데이터는 브라우저에서만 처리되며, 서버로 전송되거나 저장되지 않습니다.</li>
            <li><strong>다크 모드 지원</strong> - 밝은 화면과 어두운 화면을 자유롭게 전환할 수 있습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">제공 도구</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { cat: '취업/직장인', tools: '연봉 실수령액 계산기, 글자수 세기, 퇴직금 계산기, 실업급여 계산기, 연차 계산기, 시급/월급 변환기, 맞춤법 검사기, AI 핵심역량 추출기' },
              { cat: '이미지/파일', tools: '이미지 포맷 변환 (PNG, JPG, WebP, AVIF)' },
              { cat: '금융/생활', tools: '대출 이자 계산기 (원리금균등, 원금균등, 만기일시)' },
              { cat: '개발자', tools: 'JSON 포맷터 / 뷰어' },
            ].map(c => (
              <div key={c.cat} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="font-semibold text-sm mb-1 dark:text-white">{c.cat}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.tools}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-3">더 많은 도구가 지속적으로 추가될 예정입니다.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">면책 조항</h2>
          <p>
            본 사이트에서 제공하는 계산 결과는 참고용이며, 실제 금액은 개인의 상황에 따라 다를 수 있습니다.
            정확한 금액은 관련 기관(국세청, 국민건강보험공단, 고용노동부 등)에 문의하시기 바랍니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">운영</h2>
          <p>바로도구는 <strong>내일모코퍼레이션</strong>에서 운영합니다.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">문의</h2>
          <p>
            사이트 이용 중 문의사항이 있으시면{' '}
            <Link href="/contact" className="text-primary hover:underline">문의하기</Link> 페이지를 이용해 주세요.
          </p>
        </div>
      </section>
    </main>
  );
}
