import coupangData from '@/lib/coupang-products.json';

interface CoupangProduct {
  id: number;
  name: string;
  price: number | null;
  image: string;
  url: string;
  query?: string;
}

/**
 * 쿠팡파트너스 상품 위젯 (2026-06-02, Go#4).
 * 도구 페이지 하단에 관련 상품 2~3개를 카드형으로 노출. AdSense 본문과 분리된 별도 위젯.
 * - 제휴 링크: rel="sponsored" (Google 가이드) + target=_blank
 * - 광고 고지문구 필수 (공정위)
 * - 상품 데이터: lib/coupang-products.json (쿠팡 Open API로 생성, scripts/gen_coupang_widget_products.py)
 */
export function CoupangWidget({ tool }: { tool: string }) {
  const tools = (coupangData as { tools: Record<string, CoupangProduct[]> }).tools;
  const items = tools[tool] ?? [];
  if (items.length === 0) return null;
  const disclaimer = (coupangData as { _disclaimer: string })._disclaimer;

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 bg-gray-50/50 dark:bg-gray-800/40">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">함께 보면 좋은 상품</h3>
      <div className="grid grid-cols-3 gap-3">
        {items.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="group block rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-md transition"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
            <div className="p-2">
              <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug min-h-[2.4em]">
                {p.name}
              </p>
              {p.price != null && (
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {p.price.toLocaleString()}원
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">{disclaimer}</p>
    </section>
  );
}
