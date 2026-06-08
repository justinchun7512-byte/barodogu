import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import AgeCalculatorPage from './Client';

const tool = getToolById('age-calculator')!;

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
            { '@type': 'Question', name: '2026년 기준 내 만 나이를 빠르게 계산하는 방법은?', acceptedAnswer: { '@type': 'Answer', text: '만 나이는 생일이 지났으면 올해 연도 - 출생 연도, 생일이 안 지났으면 올해 연도 - 출생 연도 - 1로 계산합니다. 예를 들어 1995년 8월생은 2026년 6월 현재 만 30세입니다.' } },
            { '@type': 'Question', name: '2026년 한국 나이와 만 나이는 얼마나 차이 나나요?', acceptedAnswer: { '@type': 'Answer', text: '한국 나이는 만 나이보다 1~2살 많습니다. 생일이 지난 사람은 만 나이 + 1살, 생일이 안 지난 사람은 만 나이 + 2살이 한국 나이입니다.' } },
            { '@type': 'Question', name: '만 나이 통일법 이후 달라진 점은 무엇인가요?', acceptedAnswer: { '@type': 'Answer', text: '2023년 6월 28일부터 법령·계약서·행정 서류에서 만 나이가 공식 기준입니다. 금융 상품 가입 연령·보험 나이 기준도 만 나이로 통일되어 있습니다.' } },
            { '@type': 'Question', name: '연나이와 만 나이는 어떻게 다르고, 어디에 쓰나요?', acceptedAnswer: { '@type': 'Answer', text: '연나이는 올해 연도 - 출생 연도로 계산합니다. 병역법·청소년보호법·일부 취학 기준에 연나이가 적용됩니다. 2007년생은 2026년 연나이 19세, 만 나이는 생일 전이라면 18세입니다.' } },
            { '@type': 'Question', name: '보험나이는 만 나이와 다른가요?', acceptedAnswer: { '@type': 'Answer', text: '보험사에서는 생일 6개월 전후를 기준으로 반올림하는 방식을 쓰는 경우가 있습니다. 만 30세 6개월이 지났다면 보험나이는 31세로 적용될 수 있습니다.' } },
          ]
        }) }}
      />
      <AgeCalculatorPage />
    </>
  );
}
