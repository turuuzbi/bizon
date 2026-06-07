"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { useLocale } from "@/components/locale-provider";
import { getDictionary } from "@/lib/i18n";
import {
  discountPercent,
  formatPrice,
  getInitials,
  type PdpRelated,
} from "./types";

export function RelatedProducts({ related }: { related: PdpRelated[] }) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState<string | null>(null);

  if (related.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  const quickAdd = (id: string) => {
    setAdded(id);
    window.setTimeout(() => setAdded((cur) => (cur === id ? null : cur)), 1600);
  };

  return (
    <section aria-labelledby="related-heading">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="related-heading"
          className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl"
        >
          {t.pdp.relatedTitle}
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {related.map((item) => {
          const pct = discountPercent(item.price, item.compareAtPrice);
          return (
            <article
              key={item.id}
              className="group flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-black/8 bg-white transition-all hover:-translate-y-1 hover:border-[#7c3aed]/40 hover:shadow-md"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative block aspect-square overflow-hidden bg-[#f5f5f7]"
              >
                {item.image ? (
                  <img
                    src={item.image.url}
                    alt={item.image.altText?.trim() || item.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold uppercase tracking-[0.1em] text-[#7c3aed]">
                    {getInitials(item.name)}
                  </span>
                )}
                {pct > 0 ? (
                  <span className="absolute left-3 top-3 rounded-lg bg-[#7c3aed] px-2.5 py-1 text-[11px] font-semibold text-white">
                    -{pct}%
                  </span>
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9b9ba3]">
                  {item.brandName ?? "Erka's"}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="line-clamp-2 text-sm font-semibold leading-snug text-[#1d1d1f] hover:text-[#7c3aed]"
                >
                  {item.name}
                </Link>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  {item.price !== null ? (
                    <span className="text-sm font-bold text-[#1d1d1f]">
                      {formatPrice(item.price, item.currency)}
                    </span>
                  ) : (
                    <span className="text-xs text-[#6e6e73]">—</span>
                  )}
                  <button
                    type="button"
                    onClick={() => quickAdd(item.id)}
                    aria-label={t.pdp.addToCart}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors ${
                      added === item.id ? "bg-[#16a34a]" : "bg-[#7c3aed] hover:bg-[#6d28d9]"
                    }`}
                  >
                    {added === item.id ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
