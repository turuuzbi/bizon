"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "P"
  );
}

function ProductImage({ product }: { product: ProductSummary }) {
  if (product.imageUrl) {
    return (
      <div
        role="img"
        aria-label={product.imageAlt || product.name}
        className="absolute inset-4 bg-no-repeat transition-transform duration-200 group-hover:scale-[1.03]"
        style={{
          backgroundImage: `url("${product.imageUrl}")`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-white text-lg font-semibold uppercase tracking-[0.08em] text-[#8e55cf]">
        {getInitials(product.name)}
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function ProductCard({ product }: { product: ProductSummary }) {
  const t = useT();
  const tc = t.marketplace.card;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [wishlist, setWishlist] = useStoredList<ProductSummary>(WISHLIST_KEY);
  const [compareList, setCompareList] = useStoredList<ProductSummary>(COMPARE_KEY);
  const [, setCart] = useStoredList<CartEntry>(CART_KEY);

  const isWished = wishlist.some((item) => item.id === product.id);
  const isComparing = compareList.some((item) => item.id === product.id);
  const compareDisabled = !isComparing && compareList.length >= COMPARE_LIMIT;

  useEffect(() => {
    if (!isQuickViewOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsQuickViewOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isQuickViewOpen]);

  function handleAddToCart() {
    setCart((current) => addToCart(current, product, 1));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  const productHref = `/products/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[10px] border border-[#e4e4e7] bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(24,24,27,0.08)]">
      <div className="relative aspect-square overflow-hidden bg-[#f6f6f7]">
        <Link href={productHref} className="absolute inset-0" aria-label={product.name}>
          <ProductImage product={product} />
        </Link>

        {!product.inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-[6px] bg-[#18181b] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {tc.outOfStock}
            </span>
          </div>
        ) : null}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNewArrival ? (
            <span className="rounded-[6px] bg-[#16a34a] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {tc.newBadge}
            </span>
          ) : null}
          {product.isFeatured ? (
            <span className="rounded-[6px] bg-[#8e55cf] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {tc.featuredBadge}
            </span>
          ) : null}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button
            type="button"
            aria-label={isWished ? tc.removeFromWishlist : tc.addToWishlist}
            aria-pressed={isWished}
            onClick={() =>
              setWishlist((current) => toggleProductInList(current, product))
            }
            className={`flex h-7 w-7 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors ${
              isWished
                ? "border-[#8e55cf] text-[#8e55cf]"
                : "border-[#e4e4e7] text-[#3f3f46] hover:border-[#8e55cf] hover:text-[#8e55cf]"
            }`}
          >
            <HeartIcon filled={isWished} />
          </button>
          <button
            type="button"
            aria-label={tc.quickView}
            onClick={() => setIsQuickViewOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e4e4e7] bg-white/95 text-[#3f3f46] shadow-sm transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand ? (
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
            {product.brand}
          </p>
        ) : null}
        <Link href={productHref} className="line-clamp-2 text-sm font-medium leading-snug text-[#18181b] hover:text-[#8e55cf]">
          {product.name}
        </Link>

        <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#71717a]">
          {product.categoryName ? <span className="truncate">{product.categoryName}</span> : null}
          {product.categoryName ? <span aria-hidden>·</span> : null}
          <span>{product.unitLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              product.inStock ? "bg-[#16a34a]" : "bg-[#dc2626]"
            }`}
            aria-hidden
          />
          <span className={product.inStock ? "text-[#16a34a]" : "text-[#dc2626]"}>
            {product.inStock ? tc.inStock : tc.outOfStock}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#8e55cf] px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#7d45c1] disabled:cursor-not-allowed disabled:bg-[#d4d4d8]"
          >
            {justAdded ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
            {justAdded ? tc.added : tc.addToCart}
          </button>
          <button
            type="button"
            aria-label={isComparing ? tc.removeFromCompare : tc.compare}
            aria-pressed={isComparing}
            disabled={compareDisabled}
            title={compareDisabled ? t.marketplace.compare.limitReached.replace("{max}", String(COMPARE_LIMIT)) : undefined}
            onClick={() =>
              setCompareList((current) =>
                toggleProductInList(current, product, COMPARE_LIMIT),
              )
            }
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              isComparing
                ? "border-[#8e55cf] bg-[#f3ebfb] text-[#8e55cf]"
                : "border-[#e4e4e7] text-[#3f3f46] hover:border-[#8e55cf] hover:text-[#8e55cf]"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="3" y="3" width="9" height="18" rx="1.5" />
              <rect x="14" y="3" width="7" height="11" rx="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {isQuickViewOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsQuickViewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.marketplace.quickView.title}
            onClick={(event) => event.stopPropagation()}
            className="grid w-full max-w-xl gap-5 rounded-[12px] bg-white p-5 shadow-xl sm:grid-cols-2"
          >
            <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[#f6f6f7]">
              <ProductImage product={product} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
                  {product.brand ?? ""}
                </p>
                <button
                  type="button"
                  aria-label={t.marketplace.quickView.close}
                  onClick={() => setIsQuickViewOpen(false)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#71717a] hover:bg-[#f6f6f7] hover:text-[#18181b]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-[#18181b]">
                {product.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1 text-xs text-[#71717a]">
                {product.categoryName ? <span>{product.categoryName}</span> : null}
                {product.categoryName ? <span aria-hidden>·</span> : null}
                <span>{product.unitLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-[#16a34a]" : "bg-[#dc2626]"}`} aria-hidden />
                <span className={product.inStock ? "text-[#16a34a]" : "text-[#dc2626]"}>
                  {product.inStock ? tc.inStock : tc.outOfStock}
                </span>
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="rounded-[8px] bg-[#8e55cf] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1] disabled:cursor-not-allowed disabled:bg-[#d4d4d8]"
                >
                  {justAdded ? tc.added : tc.addToCart}
                </button>
                <Link
                  href={productHref}
                  className="rounded-[8px] border border-[#e4e4e7] px-4 py-2.5 text-center text-sm font-medium text-[#18181b] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                >
                  {t.marketplace.quickView.viewFullDetails}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
