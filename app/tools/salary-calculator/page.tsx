import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import SalaryCalculatorPage from './Client';

const tool = getToolById('salary-calculator')!;

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
            { '@type': 'Question', name: '연봉 5000만원이면 실제로 한 달에 얼마 받나요?', acceptedAnswer: { '@type': 'Answer', text: '2026년 기준 연봉 5,000만원의 월 실수령액은 약 350~365만원 수준입니다(부양가족 1인, 비과세 없는 일반 조건 기준). 4대보험과 소득세·지방소득세를 공제하면 총 공제액이 월 52만원 안팎이 됩니다.' } },
            { '@type': 'Question', name: '연봉 4000만원 실수령액은 얼마인가요?', acceptedAnswer: { '@type': 'Answer', text: '2026년 기준 연봉 4,000만원의 월 실수령액은 약 290~300만원 수준입니다. 연봉을 12로 나누면 월 333만원이지만, 4대보험 합산 약 30만원과 소득세·지방소득세 약 8만원이 차감됩니다.' } },
            { '@type': 'Question', name: '2026년 국민연금·건강보험 요율이 올랐나요?', acceptedAnswer: { '@type': 'Answer', text: '2026년 기준으로 국민연금 4.5%, 건강보험 3.545%, 장기요양보험(건강보험료의 12.95%), 고용보험 0.9%가 적용됩니다. 본 계산기는 2026년 최신 요율을 반영하고 있습니다.' } },
            { '@type': 'Question', name: '월급에서 실제로 빠져나가는 세금 비율은 얼마인가요?', acceptedAnswer: { '@type': 'Answer', text: '연봉 3,000~6,000만원 사이의 직장인은 대체로 월 급여의 13~17%가 4대보험과 세금으로 빠져나갑니다. 연봉 3,000만원대는 약 13%, 연봉 5,000만원대는 약 15%입니다.' } },
            { '@type': 'Question', name: '연봉 협상 시 실수령액 기준으로 비교하는 방법은?', acceptedAnswer: { '@type': 'Answer', text: '연봉 6,000만원과 5,500만원을 단순 비교하면 안 됩니다. 각각의 실수령 월급을 계산하면 약 400만원과 370만원으로 월 30만원 차이입니다. 성과급·식대·퇴직금 별도 여부도 함께 고려하세요.' } },
          ]
        }) }}
      />
      <SalaryCalculatorPage />
    </>
  );
}
