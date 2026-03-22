import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd } from '@/lib/seo';

const tool = getToolById('unemployment-calculator')!;

export const metadata = generateToolMetadata(tool);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(tool)) }} />
      {children}
    </>
  );
}
