import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import CharacterCounterPage from './Client';

const tool = getToolById('character-counter')!;

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
            { '@type': 'Question', name: '자기소개서 1,000자는 공백 포함인가요, 제외인가요?', acceptedAnswer: { '@type': 'Answer', text: '대부분의 대기업·공기업 채용 사이트는 공백 포함 기준으로 글자수를 제한합니다. 일부 기업은 공백 제외 기준을 쓰므로 반드시 채용공고를 확인하세요. 본 도구는 공백 포함·제외 글자수를 동시에 실시간으로 표시합니다.' } },
            { '@type': 'Question', name: '3분 발표 PPT 원고는 글자수를 얼마나 써야 하나요?', acceptedAnswer: { '@type': 'Answer', text: '일반적으로 발표 속도는 1분에 300~350자 수준입니다. 3분 발표라면 약 900~1,050자가 기준이고, PPT 전환 시간을 고려하면 800자 내외로 줄이는 편이 여유롭습니다.' } },
            { '@type': 'Question', name: '1,500자 공백 포함이면 A4 기준 몇 줄인가요?', acceptedAnswer: { '@type': 'Answer', text: 'A4 용지에 기본 줄 간격(1.5), 폰트 10~11pt 기준으로 한 줄에 약 35~40자가 들어갑니다. 1,500자라면 약 37~43줄, A4 약 1페이지 분량입니다.' } },
            { '@type': 'Question', name: '인스타그램 캡션 글자수 제한은 얼마인가요?', acceptedAnswer: { '@type': 'Answer', text: '인스타그램 캡션은 최대 2,200자까지 작성 가능합니다. 피드 미리보기에서는 첫 125자 이후 "더 보기"로 접히므로 핵심 내용은 첫 125자 안에 넣는 것이 좋습니다.' } },
            { '@type': 'Question', name: 'NEIS 자기소개서 바이트 수는 어떻게 계산하나요?', acceptedAnswer: { '@type': 'Answer', text: 'NEIS는 한글 3바이트, ASCII 1바이트, 줄바꿈 2바이트 기준으로 제한합니다. 한글 1,000자는 NEIS 바이트로 약 3,000바이트가 됩니다. 본 도구의 바이트 수 항목을 확인해 초과 여부를 점검하세요.' } },
          ]
        }) }}
      />
      <CharacterCounterPage />
    </>
  );
}
