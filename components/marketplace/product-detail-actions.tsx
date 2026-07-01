"use client";

import { useState } from "react";

import { useT } from "@/components/locale-provider";
import {
  CART_KEY,
  COMPARE_KEY,
  COMPARE_LIMIT,
  WISHLIST_KEY,
  addToCart,
  toggleProductInList,
  useStoredList,
} from "@/lib/marketplace-storage";
import type { CartEntry, ProductSummary } from "@/components/marketplace/types";

export function ProductDetailActions({ product }: { product: ProductSummary }) {
  const t = useT();
  const tc = t.marketplace.card;
  const [justAdded, setJustAdded] = useState(false);

  const [wishlist, setWishlist] = useStoredList<ProductSummary>(WISHLIST_KEY);
  const [compareList, setCompareList] = useStoredList<ProductSummary>(COMPARE_KEY);
  const [, setCart] = useStoredList<CartEntry>(CART_KEY);

  const isWished = wishlist.some((item) => item.id === product.id);
  const isComparing = compareList.some((item) => item.id === product.id);
  const compareDisabled = !isComparing && compareList.length >= COMPARE_LIMIT;

  function handleAddToCart() {
    setCart((current) => addToCart(current, product, 1));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#8e55cf] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1] disabled:cursor-not-allowed disabled:bg-[#d4d4d8]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {justAdded ? tc.added : tc.addToCart}
      </button>
      <button
        type="button"
        aria-pressed={isWished}
        onClick={() => setWishlist((current) => toggleProductInList(current, product))}
        className={`flex items-center justify-center gap-2 rounded-[8px] border px-5 py-3 text-sm font-medium transition-colors ${
          isWished
            ? "border-[#8e55cf] text-[#8e55cf]"
            : "border-[#e4e4e7] text-[#3f3f46] hover:border-[#8e55cf] hover:text-[#8e55cf]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {isWished ? tc.removeFromWishlist : tc.addToWishlist}
      </button>
      <button
        type="button"
        aria-pressed={isComparing}
        disabled={compareDisabled}
        onClick={() =>
          setCompareList((current) => toggleProductInList(current, product, COMPARE_LIMIT))
        }
        className={`flex items-center justify-center gap-2 rounded-[8px] border px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          isComparing
            ? "border-[#8e55cf] bg-[#f3ebfb] text-[#8e55cf]"
            : "border-[#e4e4e7] text-[#3f3f46] hover:border-[#8e55cf] hover:text-[#8e55cf]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <rect x="3" y="3" width="9" height="18" rx="1.5" />
          <rect x="14" y="3" width="7" height="11" rx="1.5" />
        </svg>
        {isComparing ? tc.removeFromCompare : tc.compare}
      </button>
    </div>
  );
}
