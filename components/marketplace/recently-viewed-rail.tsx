"use client";

import { useT } from "@/components/locale-provider";
import { ProductCard } from "@/components/marketplace/product-card";
import type { ProductSummary } from "@/components/marketplace/types";
import { RECENTLY_VIEWED_KEY, useStoredList } from "@/lib/marketplace-storage";

export function RecentlyViewedRail({ excludeId }: { excludeId?: string }) {
  const t = useT();
  const [items, setItems, hydrated] = useStoredList<ProductSummary>(
    RECENTLY_VIEWED_KEY,
  );

  const visible = items.filter((item) => item.id !== excludeId);

  if (!hydrated || visible.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-[#18181b] sm:text-2xl">
          {t.marketplace.recentlyViewed.title}
        </h2>
        <button
          type="button"
          onClick={() => setItems([])}
          className="shrink-0 text-sm font-medium text-[#71717a] hover:text-[#8e55cf]"
        >
          {t.marketplace.recentlyViewed.clear}
        </button>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {visible.map((product) => (
          <div key={product.id} className="w-[200px] shrink-0 sm:w-[230px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
