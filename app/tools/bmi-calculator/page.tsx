import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import BmiCalculatorPage from './Client';

const tool = getToolById('bmi-calculator')!;

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
            { '@type': 'Question', name: '여자 BMI 정상 범위는 남자와 다른가요?', acceptedAnswer: { '@type': 'Answer', text: 'BMI 판정 기준은 성별 무관하게 동일합니다(정상 18.5~22.9). 다만 여자는 남자보다 체지방률이 10%p 높은 경향이 있어 여성 정상 체지방률은 18~28%, 남성은 10~20%입니다.' } },
            { '@type': 'Question', name: '키 170cm, 몸무게 65kg이면 BMI는 얼마이고 정상인가요?', acceptedAnswer: { '@type': 'Answer', text: 'BMI = 65 ÷ (1.70 × 1.70) = 22.5로 정상 범위(18.5~22.9)에 해당합니다. 키 170cm의 정상 체중 범위는 약 53.5~66.4kg이므로 65kg은 정상 상한에 가까운 수준입니다.' } },
            { '@type': 'Question', name: 'BMI가 정상인데 배가 나왔습니다. 왜 그럴까요?', acceptedAnswer: { '@type': 'Answer', text: 'BMI는 체지방 분포를 반영하지 못합니다. 복부에 내장지방이 집중된 마른 비만은 BMI가 정상이어도 대사증후군 위험이 높습니다. 남성 허리둘레 90cm 이상, 여성 85cm 이상이면 복부 비만입니다.' } },
            { '@type': 'Question', name: '근육이 많으면 BMI가 높게 나오나요?', acceptedAnswer: { '@type': 'Answer', text: '맞습니다. BMI는 근육과 지방을 구분하지 않습니다. 키 175cm 체중 80kg의 운동선수는 BMI 26.1(과체중)이 나오지만 체지방률이 12%라면 매우 건강한 상태입니다.' } },
            { '@type': 'Question', name: '연령별 적정 BMI가 다른가요? 나이 들면 BMI 기준이 올라가나요?', acceptedAnswer: { '@type': 'Answer', text: '나이가 들수록 근육량이 줄어 체지방이 쌓이기 쉬워집니다. WHO 권장 기준으로 45~54세는 BMI 22~27, 65세 이상은 BMI 24~29가 적정 범위입니다.' } },
          ]
        }) }}
      />
      <BmiCalculatorPage />
    </>
  );
}
