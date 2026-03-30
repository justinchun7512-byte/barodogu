import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 - 바로도구',
  description: '바로도구의 개인정보처리방침입니다.',
  alternates: { canonical: 'https://barodogu.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-24 pb-10">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">개인정보처리방침</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
        <p>
          내일모코퍼레이션(이하 &ldquo;회사&rdquo;)은 바로도구(이하 &ldquo;서비스&rdquo;) 이용자의 개인정보를 중요시하며,
          「개인정보 보호법」 등 관련 법령을 준수합니다.
          본 개인정보처리방침은 서비스 이용 시 수집되는 개인정보의 처리에 관한 사항을 안내합니다.
        </p>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">1. 수집하는 개인정보 항목</h2>
          <p>바로도구는 <strong>별도의 회원가입 절차가 없으며</strong>, 사용자의 개인정보를 직접 수집하지 않습니다.</p>
          <p className="mt-2">다만, 서비스 이용 과정에서 아래 정보가 자동으로 생성되어 수집될 수 있습니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>접속 IP 주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
            <li>브라우저 유형, 운영체제, 화면 해상도 (Google Analytics를 통한 익명 통계)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">2. 개인정보의 처리 목적</h2>
          <p>수집된 정보는 다음의 목적으로만 사용됩니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>서비스 이용 통계 분석 및 서비스 개선</li>
            <li>서비스 안정적 운영 및 오류 대응</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">3. 개인정보의 처리 및 보유 기간</h2>
          <p>
            서비스는 사용자의 개인정보를 별도로 저장하지 않습니다.
            Google Analytics를 통해 수집되는 익명 통계 데이터는 Google의 데이터 보관 정책에 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">4. 개인정보의 제3자 제공</h2>
          <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">5. 쿠키(Cookie)의 사용</h2>
          <p>바로도구는 다음과 같은 목적으로 쿠키를 사용합니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>다크 모드 등 사용자 설정 저장 (localStorage)</li>
            <li>Google Analytics 방문 통계 (익명)</li>
            <li>Google AdSense 광고 서비스 (향후 적용 시)</li>
          </ul>
          <p className="mt-2">사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 일부 기능 이용이 제한될 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">6. 데이터 처리 방식</h2>
          <p>
            바로도구에서 제공하는 계산기, 변환기 등의 도구는 <strong>모든 데이터 처리가 사용자의 브라우저(클라이언트)에서 이루어집니다.</strong>
            입력하신 연봉, 날짜, 텍스트 등의 정보는 서버로 전송되지 않으며, 어디에도 저장되지 않습니다.
          </p>
          <p className="mt-2">
            단, 맞춤법 검사기 등 일부 기능은 외부 API를 호출할 수 있으며, 이 경우 입력된 텍스트가 해당 API 서버로 전송될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">7. 개인정보 보호책임자</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p>성명: 내일모코퍼레이션 대표</p>
            <p>이메일: justinchun7512@gmail.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">8. 개인정보처리방침 변경</h2>
          <p>이 개인정보처리방침은 법령, 정책 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 사이트를 통해 공지합니다.</p>
          <p className="mt-3 text-gray-400">시행일자: 2026년 3월 19일</p>
        </section>
      </div>
    </main>
  );
}
