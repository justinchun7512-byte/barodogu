export type Category = 'employment' | 'ai' | 'image' | 'finance' | 'developer' | 'fun' | 'health';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  tags: string[];
  isNew?: boolean;
  isHot?: boolean;
  isExternal?: boolean;
  externalUrl?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    h1?: string;
  };
  geo?: {
    definition: string;
    howToSteps?: string[];
    formula?: string;
  };
}

export interface CategoryInfo {
  id: Category | 'all';
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: '전체', icon: '📦', color: 'bg-gray-100 text-gray-600' },
  { id: 'employment', name: '취업/직장인', icon: '💼', color: 'bg-blue-100 text-blue-600' },
  { id: 'finance', name: '금융/생활', icon: '🏦', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'ai', name: 'AI 도구', icon: '✨', color: 'bg-purple-100 text-purple-600' },
  { id: 'image', name: '이미지/파일', icon: '🖼️', color: 'bg-pink-100 text-pink-600' },
  { id: 'developer', name: '개발자', icon: '🛠️', color: 'bg-orange-100 text-orange-600' },
  { id: 'fun', name: '재미', icon: '🎮', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'health', name: '생활/건강', icon: '💪', color: 'bg-green-100 text-green-600' },
];

export const TOOLS: Tool[] = [
  {
    id: 'salary-calculator',
    name: '연봉 실수령액 계산기',
    description: '2026년 세율 반영. 기본급·연봉·월급 입력하면 4대보험, 소득세 공제 후 실수령액을 1초 만에 확인.',
    category: 'employment',
    icon: '💰',
    tags: ['연봉', '실수령액', '기본급 실수령액', '세금', '4대보험', '소득세', '월급'],
    isHot: true,
    seo: {
      title: '기본급 계산기 2026 - 기본급·연봉 세후 실수령액 (월급 세후 계산)',
      description: '기본급·연봉을 입력하면 2026년 4대보험·소득세 공제 후 세후 실수령액을 1초 만에 계산합니다. 기본급 224만원·300만원·400만원 등 사례 표 포함. 기본급 연봉 계산, 월급 세후, 기본 월급 세후 계산 지원.',
      keywords: ['연봉 실수령액', '기본급 실수령액', '기본급이 224만원이면 실수령액은', '연봉 계산기', '월급 실수령액', '2026 연봉', '세후 월급', '4대보험 계산기'],
      h1: '연봉 실수령액 계산기 2026 — 기본급·월급별 세후 실수령액 표',
    },
    geo: {
      definition: '연봉 실수령액이란 연봉에서 4대보험(국민연금 4.5%·건강보험 3.545%·장기요양보험·고용보험 0.9%)과 소득세·지방소득세를 공제한 후 실제 통장에 입금되는 금액입니다.',
      howToSteps: ['연봉 또는 기본급 금액 입력', '부양가족 수 선택', '세후 실수령액·공제 내역 확인'],
      formula: '실수령액 = 월급 − 국민연금(4.5%) − 건강보험(3.545%) − 장기요양보험(건보료×12.95%) − 고용보험(0.9%) − 소득세 − 지방소득세(소득세×10%)',
    },
  },
  {
    id: 'character-counter',
    name: '글자수 세기',
    description: '자소서·이력서 글자수를 실시간으로 세어보세요. 공백 포함/제외, 바이트, 단어수, 타자수 동시 확인.',
    category: 'employment',
    icon: '✍️',
    tags: ['글자수', '타자수', '300타', '바이트', '단어수', '자소서', '이력서', '공백 포함'],
    seo: {
      title: '글자수 세기 - 공백 포함/제외 자소서·타자수 계산 (300타 공백 포함 여부)',
      description: '글자수·타자수를 실시간으로 세어보세요. 공백 포함/제외, 바이트, 단어수 동시 확인. "300타 작성시 공백 포함인가요?" 같은 자소서 글자수 기준 가이드 포함.',
      keywords: ['글자수 세기', '타자수 세기', '300타 작성시 공백 포함인가요', '글자수 계산', '자소서 글자수', '바이트 계산', '공백 포함 글자수'],
      h1: '글자수 세기 — 공백 포함/제외·타자수·바이트 동시 확인',
    },
    geo: {
      definition: '글자수 세기는 텍스트의 공백 포함/제외 글자 수, 바이트, 단어 수, 타자수를 실시간으로 측정하는 도구로 자기소개서·이력서 분량 관리에 사용합니다.',
      howToSteps: ['교정할 텍스트 입력창에 내용 붙여넣기', '공백 포함/제외 기준 선택', '글자수·타자수·바이트 동시 확인'],
    },
  },
  {
    id: 'severance-calculator',
    name: '퇴직금 계산기',
    description: '입사일, 퇴사일, 평균 월급을 입력하면 퇴직금을 계산합니다.',
    category: 'employment',
    icon: '💼',
    tags: ['퇴직금', '퇴직', '정산', '입사일', '퇴사일'],
    seo: {
      title: '퇴직금 계산기 2026 - 예상 퇴직금 계산',
      description: '입사일과 퇴사일, 평균 월급을 입력하면 예상 퇴직금을 바로 계산합니다.',
      keywords: ['퇴직금 계산기', '퇴직금 계산', '퇴직금 얼마'],
    },
    geo: {
      definition: '퇴직금이란 1년 이상 근무한 근로자가 퇴직 시 받는 법정 급여로, 계속 근무 기간 1년에 대해 30일분 평균임금을 지급합니다.',
      howToSteps: ['입사일·퇴사일 입력', '최근 3개월 평균 월급 입력', '예상 퇴직금 확인'],
      formula: '퇴직금 = 평균임금 × 30일 × (총 근무일수 ÷ 365)',
    },
  },
  {
    id: 'unemployment-calculator',
    name: '실업급여 계산기',
    description: '나이, 근무기간, 월급 기준으로 실업급여 수급액과 기간을 확인하세요.',
    category: 'employment',
    icon: '📋',
    tags: ['실업급여', '고용보험', '수급액', '수급기간'],
    seo: {
      title: '실업급여 계산기 2026 - 수급액, 수급기간 계산',
      description: '나이, 근무기간, 월급을 입력하면 실업급여 수급액과 기간을 계산합니다.',
      keywords: ['실업급여 계산기', '실업급여 수급액', '실업급여 기간'],
    },
    geo: {
      definition: '실업급여(구직급여)는 고용보험 가입 후 비자발적 실직 시 받는 급여로, 이직 전 평균임금의 60%를 최대 270일간 지급합니다.',
      howToSteps: ['나이·근무기간·월급 입력', '이직 사유 선택', '예상 수급액·수급기간 확인'],
    },
  },
  {
    id: 'annual-leave',
    name: '연차 계산기',
    description: '입사일을 입력하면 올해 연차 일수와 잔여 연차를 계산합니다.',
    category: 'employment',
    icon: '📅',
    tags: ['연차', '연차 일수', '휴가', '입사일'],
    seo: {
      title: '연차 계산기 - 입사일 기준 연차 일수 계산',
      description: '입사일을 입력하면 근로기준법에 따른 연차 일수를 바로 확인할 수 있습니다.',
      keywords: ['연차 계산기', '연차 일수', '연차 발생', '근로기준법 연차'],
    },
    geo: {
      definition: '연차 유급휴가는 근로기준법에 따라 1년간 80% 이상 출근한 근로자에게 부여되는 유급 휴일로, 1년 미만은 월 1일 발생하고 1년 이상은 최대 25일까지 발생합니다.',
      howToSteps: ['입사일 입력', '올해 연차 일수 자동 계산 확인', '잔여 연차·소멸 예정 일수 확인'],
    },
  },
  {
    id: 'wage-converter',
    name: '시급/월급 변환기',
    description: '시급, 월급, 연봉을 상호 변환합니다. 2026년 최저시급 반영.',
    category: 'employment',
    icon: '💵',
    tags: ['시급', '월급', '연봉', '최저시급', '변환'],
    seo: {
      title: '시급 월급 연봉 변환기 2026 - 최저시급 기준',
      description: '시급, 월급, 연봉을 자유롭게 변환하세요. 2026년 최저시급 기준.',
      keywords: ['시급 월급 변환', '시급 계산기', '2026 최저시급'],
    },
    geo: {
      definition: '시급·월급·연봉 변환기는 2026년 최저시급 기준으로 시급을 월급·연봉으로, 또는 연봉을 시급으로 상호 변환하는 도구입니다.',
      howToSteps: ['시급 또는 월급 또는 연봉 중 하나 입력', '나머지 값 자동 변환 확인'],
      formula: '월급 = 시급 × 209시간 (주 40시간 기준 월 평균 근무시간)',
    },
  },
  {
    id: 'spell-checker',
    name: '한국어 맞춤법 검사기 - 자소서·이메일 1초 교정',
    description: '한국어 맞춤법 검사기 무료. 자소서·이메일·보고서 맞춤법을 1초 만에 자동 교정합니다. 회원가입 없이 바로 사용.',
    category: 'employment',
    icon: '📝',
    tags: ['한국어 맞춤법 검사기', '한국 맞춤법', '맞춤법 고치기', '문법', '교정', '자소서', '보고서', '이메일', '띄어쓰기'],
    seo: {
      title: '자소서 맞춤법 검사기 무료 - 붙여넣기 1초 교정, 글자수 동시 확인',
      description: '자소서·보고서·이메일 맞춤법을 붙여넣으면 1초 만에 자동 교정합니다. 회원가입 없이 바로, 띄어쓰기·맞춤법 교정과 동시에 글자수·공백 포함 글자수까지 한 화면에서 확인. 자소서 마감 직전 가장 빠른 방법.',
      keywords: ['한국어 맞춤법 검사기', '한국 맞춤법 검사기', '맞춤법 검사기', '한국어 맞춤법', '맞춤법 고치기', '한국어 맞춤법 고치기', '자소서 맞춤법 검사', '이메일 맞춤법', '띄어쓰기 검사', '문법 검사', '무료 맞춤법', '자소서 맞춤법 글자수 동시'],
      h1: '맞춤법 검사기 — 자소서·이메일 1초 교정 (가입 없이, 글자수 동시 확인)',
    },
    geo: {
      definition: '한국어 맞춤법 검사기는 자소서·이메일·보고서 텍스트의 맞춤법·띄어쓰기 오류를 AI가 자동으로 교정해주는 무료 도구입니다. 회원가입 없이 바로 사용 가능합니다.',
      howToSteps: ['교정할 텍스트 입력 또는 붙여넣기', '맞춤법·띄어쓰기 오류 자동 교정 확인', '수정된 텍스트 복사'],
    },
  },
  {
    id: 'core-competency',
    name: 'AI 핵심역량 추출기',
    description: '채용공고 + 이력서를 넣으면 AI가 공고에 딱 맞는 핵심역량을 만들어줍니다.',
    category: 'employment',
    icon: '🎯',
    tags: ['핵심역량', '이력서', '채용공고', 'JD', 'AI', '경력기술서'],
    isNew: true,
    seo: {
      title: 'AI 핵심역량 추출기 - 채용공고 맞춤 역량 생성',
      description: '채용공고와 이력서를 입력하면 AI가 지원 공고에 딱 맞는 핵심역량을 자동으로 만들어줍니다.',
      keywords: ['핵심역량', 'AI 이력서', '채용공고 분석', '경력기술서'],
    },
    geo: {
      definition: 'AI 핵심역량 추출기는 채용공고(JD)와 이력서를 입력하면 AI가 해당 공고에 최적화된 핵심역량 문장을 자동으로 생성해주는 취업 도구입니다.',
      howToSteps: ['채용공고(JD) 텍스트 입력', '이력서 내용 입력', '맞춤 핵심역량 문장 생성 확인'],
    },
  },
  {
    id: 'interview-questions',
    name: 'AI 면접 질문 생성기',
    description: '채용공고 + 이력서를 넣으면 ChatGPT 기반 AI가 면접관이 실제로 물어볼 예상 질문과 답변 힌트를 만들어줍니다.',
    category: 'employment',
    icon: '🎤',
    tags: ['면접', '면접 질문', '챗gpt 예상 면접질문', '면접 준비', '채용공고', '이력서', 'AI', '면접관'],
    isNew: true,
    seo: {
      title: 'AI 면접 질문 생성기 - 챗GPT 예상 면접질문 + 답변 힌트 (무료)',
      description: '채용공고와 이력서를 입력하면 챗GPT 기반 AI가 면접관 시점에서 예상 면접질문을 자동 생성합니다. 질문별 빈도 등급, 면접관 의도, 답변 힌트까지 무료 제공.',
      keywords: ['챗gpt 예상 면접질문', '면접 질문', 'AI 면접 준비', '예상 면접 질문', '면접 질문 생성기', '면접 답변', 'GPT 면접'],
      h1: 'AI 면접 질문 생성기 — 챗GPT 기반 예상 면접질문·답변 힌트',
    },
    geo: {
      definition: 'AI 면접 질문 생성기는 채용공고와 이력서를 기반으로 AI가 면접관이 실제로 물어볼 예상 질문과 빈도 등급·답변 힌트를 자동으로 생성해주는 도구입니다.',
      howToSteps: ['채용공고 텍스트 입력', '이력서 내용 입력', '예상 면접질문·빈도등급·답변 힌트 확인'],
    },
  },
  // === 이미지/파일 ===
  {
    id: 'image-converter',
    name: '이미지 포맷 변환',
    description: 'PNG, JPG, WebP, AVIF 간 이미지 포맷을 자유롭게 변환하세요. 브라우저에서 처리.',
    category: 'image',
    icon: '🖼️',
    tags: ['이미지 변환', 'PNG', 'JPG', 'WebP', 'AVIF', '포맷'],
    isNew: true,
    seo: {
      title: '이미지 포맷 변환 - PNG JPG WebP AVIF 무료 변환',
      description: 'PNG, JPG, WebP, AVIF 이미지 포맷을 무료로 변환하세요. 파일이 서버로 전송되지 않아 안전합니다.',
      keywords: ['이미지 변환', 'PNG JPG 변환', 'WebP 변환', '이미지 포맷'],
    },
    geo: {
      definition: '이미지 포맷 변환기는 PNG·JPG·WebP·AVIF 형식의 이미지를 서버 전송 없이 브라우저에서 안전하게 무료 변환하는 도구입니다.',
      howToSteps: ['이미지 파일 업로드', '변환할 포맷 선택 (PNG/JPG/WebP/AVIF)', '변환된 이미지 다운로드'],
    },
  },
  {
    id: 'pdf-to-image',
    name: 'PDF → 이미지 변환',
    description: 'PDF 파일을 JPG 또는 PNG 이미지로 변환합니다. 페이지별 개별 다운로드 가능.',
    category: 'image',
    icon: '📄',
    tags: ['PDF', 'JPG', 'PNG', '이미지 변환', 'PDF 변환'],
    isNew: true,
    seo: {
      title: 'PDF to JPG/PNG 변환 - PDF 이미지 무료 변환',
      description: 'PDF 파일을 JPG, PNG 이미지로 무료 변환하세요. 서버 전송 없이 브라우저에서 안전하게 처리.',
      keywords: ['PDF JPG 변환', 'PDF PNG 변환', 'PDF 이미지 변환', 'PDF to JPG'],
    },
    geo: {
      definition: 'PDF 이미지 변환기는 PDF 파일을 페이지별로 JPG 또는 PNG 이미지로 변환하는 무료 도구입니다. 모든 처리는 브라우저에서 이루어져 파일이 서버로 전송되지 않습니다.',
      howToSteps: ['PDF 파일 업로드', '변환 포맷 선택 (JPG/PNG)', '페이지별 이미지 다운로드'],
    },
  },
  {
    id: 'hwp-converter',
    name: 'HWP/HWPX 변환기 (Beta)',
    description: 'HWP, HWPX 한글 파일을 텍스트, HTML, PDF로 변환하는 프로그램. HWPX 완벽 지원, 구형 HWP는 안내를 제공합니다. 브라우저에서 처리되어 안전합니다.',
    category: 'image',
    icon: '📃',
    tags: ['HWPX', 'HWP', 'HWPX HTML', 'HWPX 파일변환', 'HWP 변환', '한글 변환', '한글 파일', '텍스트', 'HTML', 'PDF', 'OWPML', 'HWP to PDF'],
    isNew: true,
    seo: {
      title: 'HWP HWPX → HTML 변환기 - 한글 파일 텍스트/HTML/PDF 무료 변환 프로그램',
      description: 'HWPX을 HTML으로 무료 파일변환. HWP, HWPX 한글 파일을 텍스트, HTML, PDF로 변환하는 무료 프로그램. HWPX 완벽 지원, 구형 HWP 안내 제공. 서버 전송 없이 안전합니다.',
      keywords: ['HWPX HTML 변환', 'hwpx을 html으로 파일변환 프로그램', 'HWP 변환', 'HWPX 변환', 'HWP to PDF', 'HWP 텍스트 추출', '한글 파일 변환', 'HWPX 텍스트 변환', '한글 변환기', 'HWP PDF 변환', 'OWPML'],
      h1: 'HWP/HWPX → HTML·PDF·텍스트 변환 — 한글 파일 무료 프로그램',
    },
    geo: {
      definition: 'HWP/HWPX 변환기는 한글 파일(HWPX)을 텍스트·HTML·PDF로 변환하는 무료 온라인 도구입니다. HWPX 완벽 지원, 서버 전송 없이 브라우저에서 안전하게 처리됩니다.',
      howToSteps: ['HWP 또는 HWPX 파일 업로드', '변환 형식 선택 (텍스트/HTML/PDF)', '변환 결과 다운로드 또는 복사'],
    },
  },
  // === 금융/생활 ===
  {
    id: 'loan-calculator',
    name: '대출 이자 계산기',
    description: '원리금균등, 원금균등, 만기일시 상환 방식별 대출 이자를 비교하세요.',
    category: 'finance',
    icon: '🏦',
    tags: ['대출', '이자', '원리금균등', '원금균등', '만기일시', '주담대'],
    isHot: true,
    seo: {
      title: '대출 이자 계산기 - 상환 방식별 비교',
      description: '대출 원금, 이자율, 기간을 입력하면 상환 방식별 이자와 월 상환금을 비교합니다.',
      keywords: ['대출 이자 계산기', '대출 이자', '원리금균등', '원금균등'],
    },
    geo: {
      definition: '대출 이자 계산기는 대출 원금·금리·기간을 입력해 원리금균등·원금균등·만기일시 방식별 총 이자와 월 상환액을 비교하는 도구입니다.',
      howToSteps: ['대출 원금·연 이자율·대출 기간 입력', '상환 방식 선택 (원리금균등/원금균등/만기일시)', '월 상환액·총 이자 비교 확인'],
    },
  },
  // === 생활/건강 ===
  {
    id: 'bmi-calculator',
    name: 'BMI 계산기',
    description: '키와 몸무게를 입력하면 BMI 지수와 비만도를 바로 확인합니다. 아시아 기준 적용.',
    category: 'health',
    icon: '⚖️',
    tags: ['BMI', '체질량지수', '비만도', '다이어트', '체중', '건강'],
    isNew: true,
    seo: {
      title: 'BMI 계산기 — 키·몸무게로 정상 범위·비만도 1초 확인',
      description: '키와 몸무게만 입력하면 내 BMI(체질량지수)와 정상 범위·과체중·비만 단계를 즉시 확인. 대한비만학회 아시아 기준 적용. 표준 체중·감량 목표 칼로리도 자동 계산.',
      keywords: ['BMI 계산기', '체질량지수', 'BMI 정상 범위', 'BMI 표준 체중', 'BMI 비만 기준', '여자 BMI', '남자 BMI', '비만도 측정', 'BMI 25', 'BMI 30 기준'],
      h1: 'BMI 계산기 — 체질량지수·정상 범위 1초 확인',
    },
    geo: {
      definition: 'BMI(체질량지수)는 체중(kg)을 키(m)의 제곱으로 나눈 값으로, 대한비만학회 아시아 기준에서 18.5~22.9가 정상, 23~24.9가 과체중, 25 이상이 비만입니다.',
      howToSteps: ['키(cm)와 몸무게(kg) 입력', 'BMI 지수·비만도 단계 즉시 확인', '표준 체중·감량 목표 칼로리 확인'],
      formula: 'BMI = 체중(kg) ÷ 키(m)²',
    },
  },
  {
    id: 'tdee-calculator',
    name: 'TDEE 계산기',
    description: '기초대사량(BMR)과 하루 총 소비 칼로리(TDEE)를 자동 계산합니다. 성별·나이·키·몸무게·활동량 입력만으로 다이어트 목표 칼로리 설정 완료.',
    category: 'health',
    icon: '🔥',
    tags: ['TDEE', '기초대사량', 'BMR', '칼로리', '다이어트', '체중관리'],
    isNew: true,
    seo: {
      title: 'TDEE 계산기 — 내 하루 소비 칼로리·BMR 1분 무료 계산',
      description: '성별·키·몸무게·활동량 입력만으로 TDEE(하루 소비 칼로리)와 기초대사량(BMR)을 즉시 계산. 감량·유지·증량 목표 칼로리까지 자동 추천. 다이어트 시작 전 필수 체크.',
      keywords: ['TDEE 계산기', '기초대사량 계산기', 'BMR 계산기', '하루 소비 칼로리 계산', '내 칼로리 계산', '다이어트 칼로리 계산기', '활동대사량 계산', '감량 칼로리 계산'],
      h1: 'TDEE 계산기 — 내 하루 소비 칼로리와 기초대사량(BMR) 1분 무료 계산',
    },
    geo: {
      definition: 'TDEE(Total Daily Energy Expenditure)는 기초대사량(BMR)에 활동량 계수를 곱한 하루 총 소비 칼로리로, 다이어트 목표 칼로리 설정의 기준이 됩니다.',
      howToSteps: ['성별·나이·키·몸무게 입력', '활동 수준 선택 (좌식~매우 활동적)', 'TDEE·BMR·목표 칼로리 자동 계산 확인'],
      formula: 'TDEE = BMR × 활동량 계수 (좌식 1.2 ~ 매우 활동적 1.9)',
    },
  },
  {
    id: 'dday-calculator',
    name: 'D-day 계산기',
    description: '특정 날짜까지 남은 일수 또는 지난 일수를 계산합니다. 시험, 기념일, 여행 등.',
    category: 'health',
    icon: '📆',
    tags: ['D-day', '디데이', '날짜 계산', '기념일', '시험', '남은 일수'],
    isNew: true,
    seo: {
      title: 'D-day 계산기 - 남은 일수, 지난 일수 계산',
      description: '특정 날짜까지 남은 일수(D-day) 또는 지난 일수(D+day)를 바로 계산하세요.',
      keywords: ['D-day 계산기', '디데이 계산', '남은 일수', '날짜 계산기'],
    },
    geo: {
      definition: 'D-day 계산기는 특정 날짜까지 남은 일수(D-N) 또는 지난 일수(D+N)를 계산하는 도구로 시험·기념일·여행 등의 일정 관리에 활용합니다.',
      howToSteps: ['목표 날짜 선택', '남은 일수 또는 지난 일수 즉시 확인'],
    },
  },
  {
    id: 'age-calculator',
    name: '나이 계산기',
    description: '생년월일을 입력하면 만 나이, 한국 나이, 띠를 한번에 확인합니다.',
    category: 'health',
    icon: '🎂',
    tags: ['나이', '만나이', '한국나이', '띠', '생년월일', '나이 계산'],
    isNew: true,
    seo: {
      title: '나이 계산기 - 만나이, 한국나이, 띠 확인',
      description: '생년월일을 입력하면 만 나이, 한국 나이, 띠를 한번에 확인하세요. 2023년 만나이 통일법 반영.',
      keywords: ['나이 계산기', '만나이 계산', '한국 나이', '띠 계산'],
    },
    geo: {
      definition: '나이 계산기는 생년월일을 입력해 만 나이(출생일 기준)·한국 나이(출생 연도 기준)·띠를 동시에 확인하는 도구로, 2023년 만나이 통일법을 반영합니다.',
      howToSteps: ['생년월일 입력', '만 나이·한국 나이·띠 동시 확인'],
    },
  },
  {
    id: 'holiday-calendar',
    name: '공휴일 캘린더',
    description: '대한민국 공휴일을 연도별로 한눈에 확인하세요. 법정공휴일, 대체공휴일 포함.',
    category: 'health',
    icon: '📅',
    tags: ['공휴일', '2026 공휴일', '대체공휴일', '법정공휴일', '달력', '휴일', '연휴'],
    isNew: true,
    seo: {
      title: '2026 공휴일 캘린더 - 대한민국 법정공휴일·대체공휴일',
      description: '2026년 대한민국 공휴일을 월별로 한눈에 확인하세요. 법정공휴일, 대체공휴일, 다음 공휴일까지 남은 일수 제공.',
      keywords: ['2026 공휴일', '공휴일 캘린더', '대체공휴일', '법정공휴일', '2027 공휴일', '공휴일 며칠', '연휴', '빨간날'],
    },
    geo: {
      definition: '공휴일 캘린더는 대한민국 법정공휴일·대체공휴일을 연도별로 월별 정리해 보여주는 도구로, 다음 공휴일까지 남은 일수를 실시간 확인할 수 있습니다.',
      howToSteps: ['연도 선택', '월별 공휴일·대체공휴일 확인', '다음 공휴일까지 D-day 확인'],
    },
  },
  // === 재미 ===
  {
    id: 'name-compatibility',
    name: '이름 궁합 테스트',
    description: '두 사람의 이름을 입력하면 궁합 점수와 해석을 알려드립니다.',
    category: 'fun',
    icon: '💕',
    tags: ['이름 궁합', '궁합', '연애', '커플', '이름'],
    isNew: true,
    seo: {
      title: '이름 궁합 테스트 — 두 사람 이름으로 즉시 궁합 점수·해석',
      description: '두 사람의 이름을 입력하면 100점 만점 궁합 점수와 관계 해석을 즉시 확인. 재미로 보는 무료 이름 궁합 테스트, 연인·친구·동료 누구나.',
      keywords: ['이름 궁합', '궁합 테스트', '이름 궁합 점수', '커플 궁합', '이름궁합', '무료 궁합', '이름점수', '연애 궁합'],
      h1: '이름 궁합 테스트 — 두 사람 이름으로 즉시 궁합 점수와 해석',
    },
    geo: {
      definition: '이름 궁합 테스트는 두 사람의 한글 이름 획수를 조합·분석해 0~100점 궁합 점수와 관계 해석을 제공하는 재미 도구입니다.',
      howToSteps: ['두 사람의 이름 입력 (성 포함 또는 이름만)', '궁합 점수·관계 해석 즉시 확인'],
    },
  },
  {
    id: 'mbti-compatibility',
    name: 'MBTI 궁합 테스트',
    description: '두 사람의 MBTI를 선택하면 궁합 분석과 관계 조언을 제공합니다.',
    category: 'fun',
    icon: '🧩',
    tags: ['MBTI', '궁합', 'MBTI 궁합', '성격', '연애', '16유형'],
    isNew: true,
    seo: {
      title: 'MBTI 궁합 테스트 — 16가지 유형 연애·친구·직장 궁합 분석',
      description: '두 사람의 MBTI 유형으로 연애·친구·직장 궁합을 즉시 확인. 16가지 성격 유형별 상세 궁합 분석과 관계 조언 제공. 무료 MBTI 궁합표.',
      keywords: ['MBTI 궁합', 'MBTI 궁합 테스트', 'MBTI 궁합표', 'MBTI 연애 궁합', 'MBTI 친구 궁합', 'MBTI 직장 궁합', 'INFP 궁합', 'ENFP 궁합', 'INTJ 궁합', 'MBTI 16유형 궁합'],
      h1: 'MBTI 궁합 테스트 — 16유형 연애·친구·직장 궁합표',
    },
    geo: {
      definition: 'MBTI 궁합 테스트는 두 사람의 MBTI 유형(16가지)을 기반으로 연애·친구·직장 궁합을 분석하고 관계 조언을 제공하는 도구입니다.',
      howToSteps: ['두 사람의 MBTI 유형 각각 선택', '연애·친구·직장 궁합 분석 확인', '관계 조언 확인'],
    },
  },
  // === AI 도구 ===
  {
    id: 'daily-fortune',
    name: 'AI 오늘의 운세',
    description: '생년월일을 입력하면 AI가 오늘의 운세를 알려드립니다. 총운, 재운, 애정운, 건강운.',
    category: 'ai',
    icon: '🔮',
    tags: ['운세', '오늘의 운세', '사주', 'AI', '점', '재운', '애정운'],
    isNew: true,
    seo: {
      title: 'AI 오늘의 운세 - 무료 운세 보기',
      description: '생년월일을 입력하면 AI가 오늘의 운세를 알려드립니다. 총운, 재운, 애정운, 건강운 확인.',
      keywords: ['오늘의 운세', 'AI 운세', '무료 운세', '오늘 운세'],
    },
    geo: {
      definition: 'AI 오늘의 운세는 생년월일을 기반으로 AI가 오늘의 총운·재운·애정운·건강운을 분석해주는 도구입니다.',
      howToSteps: ['생년월일 입력', '총운·재운·애정운·건강운 확인'],
    },
  },
  {
    id: 'company-compatibility',
    name: '나와 기업의 궁합',
    description: '내 성향과 기업명을 입력하면 AI가 나와 기업의 궁합을 분석합니다.',
    category: 'ai',
    icon: '🤝',
    tags: ['기업 궁합', '취업', '이직', '조직문화', 'AI', '직장'],
    isNew: true,
    seo: {
      title: 'AI 회사 궁합 테스트 — 기업명으로 조직문화 궁합 분석',
      description: '관심 기업명과 내 성향을 입력하면 AI가 회사 조직문화·근무 환경·컬처핏 궁합을 분석. 취업·이직·기업 지원 전 필수 체크. 무료.',
      keywords: ['회사 궁합', '기업 궁합', '회사 궁합 테스트', '회사 조직문화 궁합', '취업 궁합', '이직 궁합', 'AI 기업 분석', '회사 컬처핏', '기업 문화 테스트'],
      h1: 'AI 회사 궁합 테스트 — 나와 기업의 조직문화 궁합',
    },
    geo: {
      definition: '나와 기업의 궁합 테스트는 내 성향 키워드와 기업명을 입력하면 AI가 조직문화·컬처핏·근무환경 궁합을 분석해주는 취업·이직 준비 도구입니다.',
      howToSteps: ['기업명 입력', '내 성향 키워드 선택 또는 입력', 'AI 조직문화 궁합 분석 결과 확인'],
    },
  },
  // === 개발자 ===
  {
    id: 'json-formatter',
    name: 'JSON 포맷터',
    description: 'JSON을 보기 좋게 정렬하고, 유효성을 검증하세요.',
    category: 'developer',
    icon: '{ }',
    tags: ['JSON', '포맷터', '정렬', '검증', 'API', '개발자'],
    seo: {
      title: 'JSON 포맷터 / 뷰어 - JSON 정렬, 검증',
      description: 'JSON을 보기 좋게 정렬하고 유효성을 검증하세요. 개발자 필수 도구.',
      keywords: ['JSON 포맷터', 'JSON 정렬', 'JSON 뷰어', 'JSON 검증'],
    },
    geo: {
      definition: 'JSON 포맷터는 압축되거나 형식이 맞지 않는 JSON 데이터를 들여쓰기와 줄바꿈으로 보기 좋게 정렬하고 유효성을 검증하는 개발자 도구입니다.',
      howToSteps: ['JSON 텍스트 붙여넣기', '포맷 정렬 버튼 클릭', '정렬된 JSON·유효성 검증 결과 확인'],
    },
  },
];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(t => t.id === id);
}

export function getToolsByCategory(category: Category | 'all'): Tool[] {
  if (category === 'all') return TOOLS;
  return TOOLS.filter(t => t.category === category);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return TOOLS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
}

export function getCategoryInfo(id: Category): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.id === id);
}
