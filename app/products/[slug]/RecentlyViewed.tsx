"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/locale-provider";
import { getDictionary } from "@/lib/i18n";
import { formatPrice, getInitials } from "./types";

const STORAGE_KEY = "erkas:recentlyViewed";
const MAX = 12;

type RecentItem = {
  slug: string;
  name: string;
  image: string | null;
  price: number | null;
  currency: string;
  brandName: string | null;
};

export function RecentlyViewed({ current }: { current: RecentItem }) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    let stored: RecentItem[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as RecentItem[];
    } catch {
      stored = [];
    }

    // Render previously stored items (excluding the current one).
    setItems(stored.filter((item) => item.slug !== current.slug).slice(0, 8));

    // Record the current product at the front, de-duplicated.
    const next = [
      current,
      ...stored.filter((item) => item.slug !== current.slug),
    ].slice(0, MAX);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, [current]);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading">
      <h2
        id="recent-heading"
        className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl"
      >
        {t.pdp.recentlyViewedTitle}
      </h2>
      <div className="mt-6 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/products/${item.slug}`}
            className="group flex w-[180px] shrink-0 flex-col overflow-hidden rounded-lg border border-black/8 bg-white transition-all hover:-translate-y-1 hover:border-[#7c3aed]/40 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-[#f5f5f7]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-5 h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold uppercase tracking-[0.1em] text-[#7c3aed]">
                  {getInitials(item.name)}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9b9ba3]">
                {item.brandName ?? "Erka's"}
              </p>
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#1d1d1f]">
                {item.name}
              </p>
              {item.price !== null ? (
                <span className="mt-auto pt-1 text-sm font-bold text-[#1d1d1f]">
                  {formatPrice(item.price, item.currency)}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
