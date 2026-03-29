import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '클립바로 - AI 브랜드 영상 자동화 | 바로도구',
  description:
    'AI가 브랜드 영상을 자동으로 만들어드립니다. 카테고리 연출 시스템 + 17종 스타일로 고퀄리티 유튜브 쇼츠를 5분 만에. 29만원부터.',
  keywords: ['AI 영상 자동화', '유튜브 쇼츠 제작', 'AI 영상 제작', '클립바로'],
  openGraph: {
    title: '클립바로 - AI 브랜드 영상 자동화',
    description:
      'AI가 브랜드 영상을 자동으로 만들어드립니다. 카테고리 연출 시스템 + 17종 스타일로 고퀄리티 유튜브 쇼츠를 5분 만에.',
    url: 'https://barodogu.com/clipbaro',
    type: 'website',
  },
};

const WORKFLOW_STEPS = [
  {
    step: 1,
    icon: '⚙️',
    title: '설정',
    desc: '카테고리, 스타일, 캐릭터를 선택하세요',
  },
  {
    step: 2,
    icon: '📝',
    title: '대본',
    desc: 'AI가 주제에 맞는 대본을 자동 생성합니다',
  },
  {
    step: 3,
    icon: '🎙️',
    title: '음성',
    desc: 'TTS로 자연스러운 내레이션을 만듭니다',
  },
  {
    step: 4,
    icon: '🎨',
    title: '이미지',
    desc: 'AI가 장면별 이미지를 생성합니다',
  },
  {
    step: 5,
    icon: '✨',
    title: '효과',
    desc: 'Ken Burns, 자막, 전환 효과를 적용합니다',
  },
  {
    step: 6,
    icon: '🎬',
    title: '렌더링',
    desc: '완성된 영상을 MP4로 출력합니다',
  },
];

const PRICING = [
  {
    name: 'BASIC',
    price: '290,000',
    priceNum: 29,
    features: [
      '프로그램 라이선스 (영구)',
      '카테고리 8종 연출 시스템',
      '스타일 10종',
      '무료 TTS (Edge TTS)',
      '한국어 자막 최적화',
      'Ken Burns 4패턴',
      '기본 사용 가이드',
      '이메일 지원',
    ],
    notIncluded: [
      '스타일 17종 (PRO 전용 7종)',
      '캐릭터 프리셋 시스템',
      '비용 추적 대시보드',
      '1:1 세팅 지원',
    ],
    highlight: false,
  },
  {
    name: 'PRO',
    price: '590,000',
    priceNum: 59,
    features: [
      '프로그램 라이선스 (영구)',
      '카테고리 8종 연출 시스템',
      '스타일 17종 (전체)',
      '캐릭터 프리셋 시스템',
      '무료 TTS + 고품질 TTS',
      '한국어 자막 최적화',
      'Ken Burns 4패턴',
      '비용 추적 대시보드',
      '상세 사용 가이드',
      '1:1 세팅 지원 (화상/채팅)',
    ],
    notIncluded: [],
    highlight: true,
  },
];

const FEATURES = [
  {
    title: '카테고리 8종',
    desc: '먹방, 뷰티, IT, 여행, 교육, 운동, 경제, 일상 — 카테고리별 맞춤 연출',
    icon: '📂',
  },
  {
    title: '스타일 17종',
    desc: '실사, 애니메이션, 수채화, 3D 등 다양한 비주얼 스타일',
    icon: '🎨',
  },
  {
    title: '캐릭터 시스템',
    desc: '브랜드 대표 캐릭터를 설정하면 모든 장면에 일관되게 등장',
    icon: '👤',
  },
  {
    title: '무료 TTS',
    desc: 'Edge TTS 기본 제공으로 추가 비용 없이 음성 생성',
    icon: '🔊',
  },
  {
    title: 'AI 3중 폴백',
    desc: 'Gemini → Claude → OpenAI 순서로 장애 없는 안정적 운영',
    icon: '🔄',
  },
  {
    title: '비용 추적',
    desc: '영상별 API 사용량과 비용을 실시간으로 확인',
    icon: '📊',
  },
  {
    title: 'Ken Burns 효과',
    desc: '4가지 패턴으로 정적 이미지에 자연스러운 움직임 부여',
    icon: '🎞️',
  },
  {
    title: '한국어 자막',
    desc: '한글 줄바꿈, 폰트, 위치까지 최적화된 자막 시스템',
    icon: '💬',
  },
];

const FAQS = [
  {
    q: 'API 비용은 얼마인가요?',
    a: '영상 1개당 약 300원 수준입니다. Google Gemini 무료 플랜으로 시작하면 대본 생성은 0원, 이미지 생성(Fal AI)과 고품질 TTS(ElevenLabs)만 소액 과금됩니다. 무료 TTS(Edge TTS)를 사용하면 더 저렴합니다.',
  },
  {
    q: '어떤 영상을 만들 수 있나요?',
    a: '유튜브 쇼츠, 인스타 릴스, 틱톡에 올릴 수 있는 세로형(9:16) 브랜드 영상을 만듭니다. 먹방, 뷰티, IT, 여행, 교육, 운동, 경제, 일상 8가지 카테고리를 지원합니다.',
  },
  {
    q: '환불 가능한가요?',
    a: '프로그램 특성상 라이선스 발급 후에는 환불이 어렵습니다. 구매 전 상세 설명과 샘플 영상을 반드시 확인해주세요.',
  },
  {
    q: '컴퓨터 사양은 어느 정도 필요한가요?',
    a: 'Windows/Mac 모두 지원합니다. 인터넷 연결이 가능한 일반 PC면 충분합니다. AI 처리는 모두 클라우드에서 이루어지므로 고사양이 필요하지 않습니다.',
  },
  {
    q: 'BASIC과 PRO의 가장 큰 차이는 뭔가요?',
    a: 'PRO는 스타일 17종 전체 + 캐릭터 프리셋 시스템 + 비용 추적 대시보드 + 1:1 세팅 지원이 포함됩니다. 브랜드 채널을 운영하신다면 PRO를 추천드립니다.',
  },
  {
    q: '하루에 몇 개까지 만들 수 있나요?',
    a: '제한 없습니다. API 호출 한도 내에서 무제한 제작 가능합니다. Gemini 무료 플랜 기준 하루 약 50개 이상 제작 가능합니다.',
  },
];

const CONTACT_URL = 'https://barodogu.com/contact';

export default function ClipBaroPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            바로도구 프리미엄
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            AI가 영상을
            <br />
            <span className="text-primary">바로</span> 만들어드립니다
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            카테고리 연출 시스템 + 17종 스타일로
            <br className="hidden md:block" />
            고퀄리티 유튜브 쇼츠를 5분 만에 완성하세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-10">
            <span>영상 1개 제작비 약 300원</span>
            <span className="hidden sm:inline">|</span>
            <span>8종 카테고리 맞춤 연출</span>
            <span className="hidden sm:inline">|</span>
            <span>서버비 0원 구조</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
            >
              가격 확인하기
            </a>
            <a
              href="#workflow"
              className="px-8 py-3.5 border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary rounded-xl transition-colors text-lg"
            >
              어떻게 작동하나요?
            </a>
          </div>
        </div>
      </section>

      {/* Competitor Price Comparison */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-sm text-secondary-dark dark:text-secondary font-medium mb-2">
            왜 클립바로인가요?
          </p>
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            <div>
              <p className="text-gray-400 line-through text-xl md:text-2xl">
                타사 190만원
              </p>
              <p className="text-xs text-gray-400">연간 구독형</p>
            </div>
            <span className="text-3xl text-primary font-bold">&rarr;</span>
            <div>
              <p className="text-primary text-2xl md:text-3xl font-bold">
                29만원부터
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                영구 라이선스, 추가 비용 없음
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            동일한 6단계 AI 워크플로우. 더 많은 카테고리. 더 낮은 가격.
          </p>
        </div>
      </section>

      {/* 6-Step Workflow */}
      <section id="workflow" className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            6단계 자동 워크플로우
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            설정만 하면 AI가 알아서 영상을 만들어드립니다
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-colors"
            >
              <div className="absolute -top-3 -left-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {step.step}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-100 dark:bg-gray-900/50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">주요 기능</h2>
            <p className="text-gray-500 dark:text-gray-400">
              경쟁사 대비 더 많은 기능, 더 나은 안정성
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">가격</h2>
          <p className="text-gray-500 dark:text-gray-400">
            영구 라이선스. 월 구독료 없음. API 비용만 사용한 만큼.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 md:p-8 border-2 ${
                plan.highlight
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  추천
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {plan.priceNum}
                </span>
                <span className="text-lg text-gray-500">만원</span>
                <span className="text-sm text-gray-400 ml-2">(VAT 별도)</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <span className="mt-0.5 shrink-0">&mdash;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={CONTACT_URL}
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-primary hover:bg-primary-dark text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                지금 시작하기
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          * API 비용은 별도이며, 사용자 본인의 API 키를 사용합니다. 영상 1개당 약
          300원 수준.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-gray-100 dark:bg-gray-900/50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl"
              >
                <summary className="cursor-pointer p-5 font-medium flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          AI 영상 자동화, 지금 시작하세요
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          매일 영상 편집에 시간을 쓰지 마세요.
          <br />
          클립바로가 5분 만에 만들어드립니다.
        </p>
        <a
          href={CONTACT_URL}
          className="inline-block px-10 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
        >
          문의하기
        </a>
        <p className="text-sm text-gray-400 mt-4">
          카카오톡, 이메일, 크몽에서 상담 가능합니다
        </p>
      </section>
    </main>
  );
}
