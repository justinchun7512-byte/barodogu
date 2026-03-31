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
    description: '2026년 세율 반영. 4대보험, 소득세 공제 후 월 실수령액을 확인하세요.',
    category: 'employment',
    icon: '💰',
    tags: ['연봉', '실수령액', '세금', '4대보험', '소득세', '월급'],
    isHot: true,
    seo: {
      title: '연봉 실수령액 계산기 2026 - 바로도구',
      description: '2026년 연봉 실수령액을 바로 계산하세요. 4대보험, 소득세 공제 후 월 실수령액을 확인할 수 있습니다.',
      keywords: ['연봉 실수령액', '연봉 계산기', '2026 연봉', '세후 월급'],
    },
  },
  {
    id: 'character-counter',
    name: '글자수 세기',
    description: '공백 포함/제외, 바이트, 단어수를 실시간으로 확인하세요.',
    category: 'employment',
    icon: '✍️',
    tags: ['글자수', '바이트', '단어수', '자소서', '이력서'],
    seo: {
      title: '글자수 세기 - 공백 포함/제외, 바이트 계산 | 바로도구',
      description: '글자수를 실시간으로 세어보세요. 공백 포함/제외, 바이트, 단어수를 한눈에 확인.',
      keywords: ['글자수 세기', '글자수 계산', '바이트 계산', '자소서 글자수'],
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
      title: '퇴직금 계산기 2026 - 바로도구',
      description: '입사일과 퇴사일, 평균 월급을 입력하면 예상 퇴직금을 바로 계산합니다.',
      keywords: ['퇴직금 계산기', '퇴직금 계산', '퇴직금 얼마'],
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
      title: '실업급여 계산기 2026 - 바로도구',
      description: '나이, 근무기간, 월급을 입력하면 실업급여 수급액과 기간을 계산합니다.',
      keywords: ['실업급여 계산기', '실업급여 수급액', '실업급여 기간'],
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
      title: '연차 계산기 - 입사일 기준 연차 일수 | 바로도구',
      description: '입사일을 입력하면 근로기준법에 따른 연차 일수를 바로 확인할 수 있습니다.',
      keywords: ['연차 계산기', '연차 일수', '연차 발생', '근로기준법 연차'],
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
      title: '시급 월급 연봉 변환기 2026 - 바로도구',
      description: '시급, 월급, 연봉을 자유롭게 변환하세요. 2026년 최저시급 기준.',
      keywords: ['시급 월급 변환', '시급 계산기', '2026 최저시급'],
    },
  },
  {
    id: 'spell-checker',
    name: '맞춤법 검사기',
    description: '텍스트를 입력하면 맞춤법 오류를 찾아 교정을 제안합니다.',
    category: 'employment',
    icon: '📝',
    tags: ['맞춤법', '문법', '교정', '자소서', '보고서'],
    seo: {
      title: '맞춤법 검사기 - 한국어 맞춤법 교정 | 바로도구',
      description: '한국어 맞춤법을 바로 검사하세요. 자소서, 보고서 작성 시 필수 도구.',
      keywords: ['맞춤법 검사기', '맞춤법 검사', '한국어 교정'],
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
      title: 'AI 핵심역량 추출기 - 채용공고 맞춤 역량 생성 | 바로도구',
      description: '채용공고와 이력서를 입력하면 AI가 지원 공고에 딱 맞는 핵심역량을 자동으로 만들어줍니다.',
      keywords: ['핵심역량', 'AI 이력서', '채용공고 분석', '경력기술서'],
    },
  },
  {
    id: 'interview-questions',
    name: 'AI 면접 질문 생성기',
    description: '채용공고 + 이력서를 넣으면 면접관이 실제로 물어볼 질문과 답변 힌트를 만들어줍니다.',
    category: 'employment',
    icon: '🎤',
    tags: ['면접', '면접 질문', '면접 준비', '채용공고', '이력서', 'AI', '면접관'],
    isNew: true,
    seo: {
      title: 'AI 면접 질문 생성기 - 예상 면접 질문 + 답변 힌트 | 바로도구',
      description: '채용공고와 이력서를 입력하면 AI가 면접관 시점에서 예상 질문을 생성합니다. 질문별 빈도 등급, 면접관 의도, 답변 힌트까지 제공.',
      keywords: ['면접 질문', 'AI 면접 준비', '예상 면접 질문', '면접 질문 생성기', '면접 답변'],
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
      title: '이미지 포맷 변환 - PNG JPG WebP AVIF 변환 | 바로도구',
      description: 'PNG, JPG, WebP, AVIF 이미지 포맷을 무료로 변환하세요. 파일이 서버로 전송되지 않아 안전합니다.',
      keywords: ['이미지 변환', 'PNG JPG 변환', 'WebP 변환', '이미지 포맷'],
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
      title: 'PDF to JPG/PNG 변환 - PDF 이미지 변환 | 바로도구',
      description: 'PDF 파일을 JPG, PNG 이미지로 무료 변환하세요. 서버 전송 없이 브라우저에서 안전하게 처리.',
      keywords: ['PDF JPG 변환', 'PDF PNG 변환', 'PDF 이미지 변환', 'PDF to JPG'],
    },
  },
  {
    id: 'hwp-converter',
    name: 'HWPX 변환기 (Beta)',
    description: 'HWPX 파일을 텍스트, HTML, PDF로 변환합니다. 브라우저에서 처리되어 안전합니다.',
    category: 'image',
    icon: '📃',
    tags: ['HWPX', 'HWP', '한글 변환', '텍스트', 'HTML', 'PDF', 'OWPML'],
    isNew: true,
    seo: {
      title: 'HWPX 변환기 - 텍스트/HTML/PDF 변환 | 바로도구',
      description: 'HWPX 파일을 텍스트, HTML, PDF로 무료 변환하세요. 파일이 서버로 전송되지 않아 안전합니다.',
      keywords: ['HWPX 변환', 'HWPX 텍스트 변환', 'HWPX HTML 변환', '한글 변환기', 'OWPML'],
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
      title: '대출 이자 계산기 - 상환 방식별 비교 | 바로도구',
      description: '대출 원금, 이자율, 기간을 입력하면 상환 방식별 이자와 월 상환금을 비교합니다.',
      keywords: ['대출 이자 계산기', '대출 이자', '원리금균등', '원금균등'],
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
      title: 'BMI 계산기 - 체질량지수 비만도 측정 | 바로도구',
      description: '키와 몸무게를 입력하면 BMI 체질량지수와 비만도를 바로 확인하세요. 대한비만학회 아시아 기준 적용.',
      keywords: ['BMI 계산기', '체질량지수', '비만도 계산', 'BMI 측정'],
    },
  },
  {
    id: 'tdee-calculator',
    name: '칼로리/기초대사량 계산기',
    description: '성별, 나이, 키, 몸무게, 활동량을 입력하면 기초대사량(BMR)과 하루 소비 칼로리(TDEE)를 계산합니다.',
    category: 'health',
    icon: '🔥',
    tags: ['칼로리', '기초대사량', 'TDEE', 'BMR', '다이어트', '체중관리'],
    isNew: true,
    seo: {
      title: '칼로리 기초대사량(TDEE) 계산기 | 바로도구',
      description: '기초대사량(BMR)과 하루 총 소비 칼로리(TDEE)를 계산하세요. 다이어트 목표 칼로리 설정에 필수.',
      keywords: ['기초대사량 계산기', 'TDEE 계산기', '칼로리 계산', '다이어트 칼로리'],
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
      title: 'D-day 계산기 - 남은 일수 계산 | 바로도구',
      description: '특정 날짜까지 남은 일수(D-day) 또는 지난 일수(D+day)를 바로 계산하세요.',
      keywords: ['D-day 계산기', '디데이 계산', '남은 일수', '날짜 계산기'],
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
      title: '나이 계산기 - 만나이/한국나이/띠 | 바로도구',
      description: '생년월일을 입력하면 만 나이, 한국 나이, 띠를 한번에 확인하세요. 2023년 만나이 통일법 반영.',
      keywords: ['나이 계산기', '만나이 계산', '한국 나이', '띠 계산'],
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
      title: '이름 궁합 테스트 - 무료 이름 궁합 | 바로도구',
      description: '두 사람의 이름으로 궁합 점수를 확인하세요. 재미로 보는 이름 궁합 테스트.',
      keywords: ['이름 궁합', '궁합 테스트', '이름 궁합 점수', '커플 궁합'],
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
      title: 'MBTI 궁합 테스트 - 16가지 유형 궁합 | 바로도구',
      description: '두 사람의 MBTI 유형으로 궁합을 확인하세요. 16가지 성격 유형별 궁합 분석.',
      keywords: ['MBTI 궁합', 'MBTI 궁합 테스트', 'MBTI 연애 궁합', 'MBTI 유형'],
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
      title: 'AI 오늘의 운세 - 무료 운세 보기 | 바로도구',
      description: '생년월일을 입력하면 AI가 오늘의 운세를 알려드립니다. 총운, 재운, 애정운, 건강운 확인.',
      keywords: ['오늘의 운세', 'AI 운세', '무료 운세', '오늘 운세'],
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
      title: '나와 기업의 궁합 - AI 기업 궁합 분석 | 바로도구',
      description: '내 성향과 기업명을 입력하면 AI가 조직문화 궁합을 분석합니다. 취업, 이직 결정에 참고하세요.',
      keywords: ['기업 궁합', '회사 궁합', '조직문화', '취업 궁합'],
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
      title: 'JSON 포맷터 / 뷰어 - JSON 정렬, 검증 | 바로도구',
      description: 'JSON을 보기 좋게 정렬하고 유효성을 검증하세요. 개발자 필수 도구.',
      keywords: ['JSON 포맷터', 'JSON 정렬', 'JSON 뷰어', 'JSON 검증'],
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
