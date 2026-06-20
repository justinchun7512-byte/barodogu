import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import NameCompatibilityPage from './Client';

const tool = getToolById('name-compatibility')!;

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
            { '@type': 'Question', name: '이름 궁합 점수 100점이 나오면 정말 잘 어울리는 건가요?', acceptedAnswer: { '@type': 'Answer', text: '이름 궁합 점수는 획수 계산 기반의 재미 지표로, 실제 두 사람의 성격이나 관계를 과학적으로 측정하는 것이 아닙니다. 100점이 나왔다고 반드시 잘 맞는 커플이 되는 건 아니며, 낮은 점수가 나왔다고 실제 궁합이 나쁜 것도 아닙니다. 재미로 즐기는 도구로 활용하시길 권장합니다.' } },
            { '@type': 'Question', name: '이름이 한 글자인 경우에도 궁합 계산이 되나요?', acceptedAnswer: { '@type': 'Answer', text: '네, 한 글자 이름도 계산됩니다. 이름 1에 한 글자, 이름 2에 두 글자를 입력하면 두 이름의 획수를 번갈아 배치하여 계산합니다. 다만 글자 수가 다를 경우 짧은 이름은 배치 시 순서상 일부 반복되지 않아 점수 분포가 일반적인 두 글자 이름과 다소 다를 수 있습니다.' } },
            { '@type': 'Question', name: '이름 궁합과 MBTI 궁합, 어떤 게 더 정확한가요?', acceptedAnswer: { '@type': 'Answer', text: '두 가지 모두 과학적 근거가 있는 측정 방법은 아닙니다. 이름 궁합은 전통적인 획수 놀이를 디지털로 구현한 것이고, MBTI 궁합은 성격 유형을 기반으로 한 재미 지표입니다. 실제 관계의 궁합은 공통 관심사, 가치관, 소통 방식 등 훨씬 복잡한 요소에 의해 결정됩니다.' } },
            { '@type': 'Question', name: '외국인 이름(영문)도 궁합 계산이 가능한가요?', acceptedAnswer: { '@type': 'Answer', text: '현재 이 도구는 한글 이름만 지원합니다. 한글 자모의 획수를 기반으로 계산하기 때문에 영문이나 한자 이름을 입력하면 0점이 산출됩니다. 외국인 파트너의 경우 한국어 이름이 있다면 그 이름으로 입력하시거나, MBTI 궁합 계산기를 활용해보시기 바랍니다.' } },
            { '@type': 'Question', name: '이름 궁합 점수가 매번 다르게 나오는 경우가 있나요?', acceptedAnswer: { '@type': 'Answer', text: '동일한 이름을 입력하면 항상 같은 점수가 나옵니다. 점수가 다르게 나왔다면 이름 입력 시 띄어쓰기가 포함됐거나, 성과 이름을 다르게 입력했을 가능성이 큽니다. 성을 포함한 이름(예: 홍길동)과 이름만(예: 길동)은 서로 다른 점수가 나옵니다.' } },
          ]
        }) }}
      />
      <NameCompatibilityPage />
    </>
  );
}
