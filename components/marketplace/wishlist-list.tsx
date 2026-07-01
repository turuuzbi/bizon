"use client";

import Link from "next/link";

import { useT } from "@/components/locale-provider";
import { ProductCard } from "@/components/marketplace/product-card";
import type { ProductSummary } from "@/components/marketplace/types";
import { WISHLIST_KEY, useStoredList } from "@/lib/marketplace-storage";

export function WishlistList() {
  const t = useT();
  const [items, , hydrated] = useStoredList<ProductSummary>(WISHLIST_KEY);

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#d4d4d8] bg-[#f6f6f7] px-6 py-14 text-center">
        <h2 className="text-xl font-semibold text-[#18181b]">
          {t.marketplace.wishlist.empty}
        </h2>
        <p className="mt-2 text-sm text-[#71717a]">{t.marketplace.wishlist.emptyHint}</p>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-[8px] bg-[#8e55cf] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
        >
          {t.marketplace.wishlist.browseCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
