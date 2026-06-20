import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import MbtiCompatibilityPage from './Client';

const tool = getToolById('mbti-compatibility')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(tool)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd(tool)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'MBTI 궁합이 낮으면 연애를 못하나요?', acceptedAnswer: { '@type': 'Answer', text: '아닙니다. MBTI는 성격의 경향성을 나타낼 뿐이며, 과학적으로 검증된 궁합 측정 도구가 아닙니다. 실제 관계에서는 서로에 대한 이해, 존중, 소통 방식이 훨씬 중요합니다. 궁합 점수가 낮더라도 서로를 이해하고 노력하면 충분히 좋은 관계를 만들 수 있습니다.' } },
            { '@type': 'Question', name: '같은 MBTI끼리는 궁합이 좋나요?', acceptedAnswer: { '@type': 'Answer', text: '동일 유형끼리는 서로를 잘 이해하지만 같은 약점을 공유한다는 단점도 있습니다. 예를 들어 두 명의 P(인식형)가 만나면 계획 없이 즉흥적으로 흘러갈 수 있고, 두 명의 F(감정형)가 만나면 갈등 해결이 어려울 수 있습니다. 이 도구에서는 동일 유형을 "보통 궁합" 등급으로 분류합니다.' } },
            { '@type': 'Question', name: 'MBTI가 바뀔 수도 있나요?', acceptedAnswer: { '@type': 'Answer', text: '핵심 인지 기능 선호는 비교적 안정적이지만, 환경·나이·경험에 따라 측정 결과가 달라질 수 있습니다. 특히 E/I(외향/내향)는 상황에 따라 점수 차이가 작아 검사 때마다 바뀌는 경우가 많습니다.' } },
            { '@type': 'Question', name: 'MBTI 궁합 점수는 어떻게 계산하나요?', acceptedAnswer: { '@type': 'Answer', text: '이 도구는 두 유형의 인지 기능 유사성과 보완성을 기준으로 미리 정의된 점수표를 사용합니다. INFJ-ENFP처럼 직관(N)과 감정(F)을 공유하면서 에너지 방향(I/E)만 다른 조합은 높은 점수를 받고, 기능이 전혀 맞지 않는 조합은 낮은 점수를 받습니다.' } },
            { '@type': 'Question', name: 'MBTI 궁합 표는 어디에서 볼 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '이 도구의 궁합 결과 화면에서 두 유형의 점수와 등급(천생연분·잘 맞는 조합·보통·도전적 조합)을 바로 확인할 수 있습니다. 결과 페이지 하단의 "16유형별 천생연분 베스트 파트너" 섹션에서 전체 조합을 참고하세요.' } },
          ]
        }) }}
      />
      <MbtiCompatibilityPage />
    </>
  );
}
