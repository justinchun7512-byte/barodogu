import type { Metadata } from 'next';

import BetaSignupForm from './BetaSignupForm';

export const metadata: Metadata = {
  title: '클립바로 - AI 브랜드 영상 자동화 (베타 신청) | 바로도구',
  description:
    'AI가 브랜드 영상을 자동으로 만들어드립니다. 카테고리 연출 시스템 + 17종 스타일로 고퀄리티 유튜브 쇼츠를 5분 만에. 베타 기간 무료 이용 가능.',
  keywords: ['AI 영상 자동화', '유튜브 쇼츠 제작', 'AI 영상 제작', '클립바로', '베타'],
  openGraph: {
    title: '클립바로 - AI 브랜드 영상 자동화',
    description:
      '카테고리 연출 시스템 + 17종 스타일로 고퀄리티 유튜브 쇼츠를 5분 만에. 베타 기간 무료 이용 가능.',
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

// 정식 출시 시 적용 예정 가격 (베타 기간은 무료)
const PRICING_PREVIEW = [
  {
    name: 'STARTER',
    price: '2,900',
    tag: '입문',
    features: ['영상 10편 제공', 'Edge TTS', '기본 스타일 10종', '한글 자막'],
  },
  {
    name: 'BASIC',
    price: '9,900',
    tag: '개인 크리에이터',
    features: [
      '영상 40편 제공',
      '스타일 17종 전체',
      'Ken Burns 4패턴',
      '한글 자막',
    ],
    highlight: true,
  },
  {
    name: 'PRO',
    price: '29,900',
    tag: '브랜드 채널',
    features: [
      '영상 150편 제공',
      '캐릭터 프리셋',
      '고품질 TTS',
      '1:1 세팅 지원',
    ],
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
    title: 'AI 이미지 자동 생성',
    desc: 'Gemini Imagen + DALL-E 다중 제공자로 장면별 이미지 자동 생성',
    icon: '🤖',
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
  {
    title: '9:16 세로 영상',
    desc: '유튜브 쇼츠, 인스타 릴스, 틱톡 모두 업로드 가능',
    icon: '📱',
  },
];

const FAQS = [
  {
    q: '베타 기간엔 어떻게 이용하나요?',
    a: '베타 신청 후 발송된 초대 코드로 가입하시면 베타 기간 동안 무료로 이용 가능합니다. 초대 코드는 선착순 발송되며 발송 시기는 이메일로 안내드립니다.',
  },
  {
    q: '정식 출시는 언제인가요?',
    a: '2026년 6~7월 중 정식 출시 예정입니다. 베타 기간 이용자에게는 정식 출시 시 할인 혜택을 제공할 계획입니다.',
  },
  {
    q: '설치가 필요한가요?',
    a: '웹에서 바로 사용 가능합니다. 별도 프로그램 설치나 특별한 컴퓨터 사양이 필요하지 않습니다. 크롬·사파리 등 일반 브라우저에서 동작합니다.',
  },
  {
    q: '어떤 영상을 만들 수 있나요?',
    a: '유튜브 쇼츠, 인스타 릴스, 틱톡에 올릴 수 있는 세로형(9:16) 브랜드 영상을 만듭니다. 먹방, 뷰티, IT, 여행, 교육, 운동, 경제, 일상 8가지 카테고리를 지원합니다.',
  },
  {
    q: '하루에 몇 개까지 만들 수 있나요?',
    a: '베타 기간은 합리적 사용 범위 내에서 무제한입니다. 정식 출시 이후 요금제별 제작 한도(10~150편)가 적용됩니다.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '베타 기간은 무료이므로 환불 사항이 없습니다. 정식 출시 후에는 결제 방식에 따라 환불 정책이 안내되며, 기본적으로 구매 후 7일 이내 미사용 시 전액 환불을 원칙으로 합니다.',
  },
];

export default function ClipBaroPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-secondary/20 text-secondary-dark dark:bg-secondary/30 dark:text-secondary">
            &#127873; 베타 기간 무료 · 초대 코드 선착순
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
            <span>웹에서 바로 사용</span>
            <span className="hidden sm:inline">|</span>
            <span>8종 카테고리 맞춤 연출</span>
            <span className="hidden sm:inline">|</span>
            <span>한국어 자막 최적화</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#beta"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
            >
              베타 신청하기
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

      {/* Pricing Preview */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/20 text-secondary-dark dark:bg-secondary/30 dark:text-secondary">
            &#127873; 베타 기간 무료
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            정식 출시 가격 (미리보기)
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            베타 기간은 초대 코드로 무료 이용 · 정식 출시 시 아래 수준에서 요금 결정 예정
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING_PREVIEW.map((plan) => (
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {plan.tag}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  {plan.price}
                </span>
                <span className="text-base text-gray-500">원~</span>
              </div>
              <ul className="space-y-2.5 mb-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          * 최종 가격·결제 방식(월 구독 / 일회성 구매 등)은 정식 출시 시점에 확정됩니다.
          베타 참가자에게는 할인 혜택 제공 예정.
        </p>
      </section>

      {/* Beta Signup */}
      <section
        id="beta"
        className="max-w-5xl mx-auto px-4 py-16 bg-primary/5 dark:bg-primary/10 rounded-3xl mx-4 md:mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            베타 신청하기
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            선착순으로 초대 코드를 발송해드립니다.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            베타 기간 내내 무료 · 정식 출시 시 할인 혜택
          </p>
        </div>
        <BetaSignupForm />
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
          AI 영상 자동화, 지금 먼저 경험하세요
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          매일 영상 편집에 시간을 쓰지 마세요.
          <br />
          베타 초대 코드로 먼저 써보실 수 있습니다.
        </p>
        <a
          href="#beta"
          className="inline-block px-10 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
        >
          베타 신청하기
        </a>
      </section>
    </main>
  );
}
