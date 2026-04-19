import type { Metadata } from 'next';
import { getToolById } from '@/lib/tools';
import { generateToolMetadata, generateJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { mergeKoreanHolidays } from '@/lib/holidays-ko';
import HolidayCalendarPage, { Holiday } from './Client';

const tool = getToolById('holiday-calendar')!;

export const metadata: Metadata = generateToolMetadata(tool);

export const revalidate = 86400;

async function fetchHolidays(year: number): Promise<Holiday[]> {
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/KR`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return mergeKoreanHolidays(year, []);
    const base: Holiday[] = await res.json();
    return mergeKoreanHolidays(year, base);
  } catch {
    return mergeKoreanHolidays(year, []);
  }
}

export default async function Page() {
  const currentYear = new Date().getFullYear();
  const initialHolidays = await fetchHolidays(currentYear);

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
      <HolidayCalendarPage initialYear={currentYear} initialHolidays={initialHolidays} />
    </>
  );
}
