import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import SeveranceCalculatorPage from './Client';

const tool = getToolById('severance-calculator')!;

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
            { '@type': 'Question', name: '1년 근무 후 퇴직하면 퇴직금이 얼마나 나오나요?', acceptedAnswer: { '@type': 'Answer', text: '월급 300만원으로 정확히 1년 근무했다면 퇴직금은 약 300만원(세전)이 됩니다. 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365) 공식으로 계산합니다. 1년 미만 근무 시에는 퇴직금 지급 의무가 없습니다.' } },
            { '@type': 'Question', name: '퇴직금 평균임금 계산 시 상여금은 어떻게 포함하나요?', acceptedAnswer: { '@type': 'Answer', text: '매달 정기적으로 지급된 상여금은 평균임금에 포함됩니다. 1년에 한 번 지급되는 연간 상여금은 3개월 기준 금액(연간 상여금 ÷ 12 × 3)으로 산입합니다.' } },
            { '@type': 'Question', name: '퇴직금에 붙는 세금(퇴직소득세)은 얼마나 되나요?', acceptedAnswer: { '@type': 'Answer', text: '퇴직금에는 퇴직소득세가 별도로 부과됩니다. 근속연수가 길수록 세금이 줄어드는 구조로, 5년 근무 후 퇴직금 1,500만원이라면 퇴직소득세가 수십만원 수준에 그칩니다. 본 계산기는 세전 금액을 보여줍니다.' } },
            { '@type': 'Question', name: '퇴직금을 회사가 14일 안에 안 줘도 되나요?', acceptedAnswer: { '@type': 'Answer', text: '근로기준법 제36조에 따라 퇴직금은 퇴직일로부터 14일 이내에 지급해야 합니다. 14일을 초과하면 연 20%의 지연이자가 붙습니다.' } },
            { '@type': 'Question', name: '퇴직연금(IRP)과 일반 퇴직금의 차이는?', acceptedAnswer: { '@type': 'Answer', text: '일반 퇴직금은 회사가 내부에 적립 후 퇴직 시 일시금으로 지급합니다. IRP는 퇴직금을 55세까지 유지하면 퇴직소득세 30~40% 절감 혜택이 있어 장기적으로 유리합니다.' } },
          ]
        }) }}
      />
      <SeveranceCalculatorPage />
    </>
  );
}
