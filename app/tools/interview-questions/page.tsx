import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd } from '@/lib/seo';
import InterviewQuestionsPage from './Client';

const tool = getToolById('interview-questions')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(tool)) }}
      />
      <InterviewQuestionsPage />
    </>
  );
}
