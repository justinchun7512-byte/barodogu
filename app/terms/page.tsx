import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 - 바로도구',
  description: '바로도구 서비스 이용약관입니다.',
  alternates: { canonical: 'https://barodogu.com/terms' },
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">이용약관</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
        <p>
          본 이용약관(이하 &ldquo;약관&rdquo;)은 내일모코퍼레이션(이하 &ldquo;회사&rdquo;)이 운영하는
          바로도구(barodogu.com, 이하 &ldquo;서비스&rdquo;) 이용에 관한 조건 및 절차를 규정합니다.
          서비스를 이용하시는 경우 본 약관에 동의한 것으로 간주됩니다.
        </p>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제1조 (목적)</h2>
          <p>
            본 약관은 회사가 제공하는 온라인 유틸리티 도구 서비스의 이용과 관련하여
            회사와 이용자 간의 권리, 의무 및 책임 사항을 규정하는 것을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제2조 (서비스의 내용)</h2>
          <p>회사는 다음과 같은 서비스를 제공합니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>연봉 실수령액 계산기, 퇴직금 계산기 등 취업/직장인용 계산 도구</li>
            <li>글자수 세기, 맞춤법 검사기 등 텍스트 관련 도구</li>
            <li>이미지 포맷 변환, PDF 변환 등 파일 처리 도구</li>
            <li>대출 이자 계산기 등 금융/생활 도구</li>
            <li>JSON 포맷터 등 개발자용 도구</li>
            <li>기타 회사가 추가 개발하여 제공하는 온라인 도구</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제3조 (서비스 이용)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>서비스는 별도의 회원가입 없이 누구나 무료로 이용할 수 있습니다.</li>
            <li>서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검 등의 사유로 일시 중단될 수 있습니다.</li>
            <li>서비스의 모든 계산 및 처리는 사용자의 브라우저에서 수행되며, 입력 데이터는 서버에 전송되거나 저장되지 않습니다(일부 API 기반 도구 제외).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제4조 (이용자의 의무)</h2>
          <p>이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>자동화 프로그램을 이용한 대량 접속 또는 데이터 수집 행위</li>
            <li>서비스를 이용하여 타인의 권리를 침해하는 행위</li>
            <li>기타 관련 법령에 위반되는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제5조 (결과의 정확성 및 면책)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>서비스에서 제공하는 계산 결과, 변환 결과 등은 참고용이며, 법적 효력을 가지지 않습니다.</li>
            <li>연봉 계산, 퇴직금 계산, 실업급여 계산 등의 결과는 실제 금액과 차이가 있을 수 있으며, 정확한 금액은 관련 기관에 확인하시기 바랍니다.</li>
            <li>서비스 이용으로 인해 발생하는 직접적, 간접적 손해에 대해 회사는 책임을 지지 않습니다.</li>
            <li>파일 변환 등의 기능 사용 시 원본 파일의 백업은 이용자의 책임입니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제6조 (지적재산권)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>서비스의 디자인, 코드, 콘텐츠 등에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.</li>
            <li>이용자는 서비스를 이용하여 얻은 정보를 개인적 용도로 사용할 수 있으나, 상업적 목적으로 무단 복제, 배포할 수 없습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제7조 (광고 게재)</h2>
          <p>
            회사는 서비스 운영을 위해 서비스 화면에 광고를 게재할 수 있습니다.
            광고와 관련한 거래는 광고주와 이용자 간의 문제이며, 회사는 이에 대해 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제8조 (서비스 변경 및 중단)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>회사는 서비스의 내용을 변경하거나, 새로운 도구를 추가 또는 제거할 수 있습니다.</li>
            <li>불가피한 사유로 서비스를 중단하는 경우, 가능한 범위 내에서 사전 공지합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제9조 (약관의 변경)</h2>
          <p>
            회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수 있으며,
            변경된 약관은 서비스 내 공지를 통해 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 dark:text-white">제10조 (분쟁 해결)</h2>
          <p>
            서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 이용자는 상호 협의하여 해결하며,
            협의가 이루어지지 않는 경우 관할 법원에 따릅니다.
          </p>
        </section>

        <div className="border-t pt-6 mt-8 text-xs text-gray-500 dark:text-gray-400">
          <p>시행일: 2026년 3월 25일</p>
          <p className="mt-1">내일모코퍼레이션</p>
        </div>
      </div>
    </main>
  );
}
