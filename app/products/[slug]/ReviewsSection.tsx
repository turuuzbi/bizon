"use client";

import { useMemo, useState } from "react";

import { useLocale } from "@/components/locale-provider";
import { formatString, getDictionary } from "@/lib/i18n";
import { getInitials, type PdpReview } from "./types";

type SortKey = "newest" | "highest" | "lowest";

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(value);
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={className}
            fill={filled ? "#f59e0b" : "none"}
            stroke={filled ? "#f59e0b" : "#d4d4d8"}
            strokeWidth="1.6"
            strokeLinejoin="round"
          >
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9z" />
          </svg>
        );
      })}
    </span>
  );
}

export function ReviewsSection({
  reviews,
  ratingAverage,
  ratingCount,
  distribution,
}: {
  reviews: PdpReview[];
  ratingAverage: number | null;
  ratingCount: number;
  distribution: number[];
}) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const [sort, setSort] = useState<SortKey>("newest");
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const visible = useMemo(() => {
    let list = reviews;
    if (starFilter) list = list.filter((r) => Math.round(r.rating) === starFilter);
    const sorted = [...list];
    if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating);
    else sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return sorted;
  }, [reviews, sort, starFilter]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "mn" ? "mn-MN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <section aria-labelledby="reviews-heading" className="scroll-mt-24">
      <h2
        id="reviews-heading"
        className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl"
      >
        {t.pdp.reviewsTitle}
      </h2>

      {ratingCount === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-black/10 bg-[#f5f5f7] px-5 py-10 text-center text-sm text-[#6e6e73]">
          {t.pdp.noReviews}
        </p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Summary */}
          <div className="rounded-lg border border-black/8 bg-white p-6">
            <div className="flex items-baseline gap-2">
              <span className="font-[family:var(--font-display)] text-5xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                {(ratingAverage ?? 0).toFixed(1)}
              </span>
              <span className="text-sm text-[#6e6e73]">/ 5</span>
            </div>
            <div className="mt-2">
              <Stars value={ratingAverage ?? 0} className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm text-[#6e6e73]">
              {formatString(t.pdp.reviewsBasedOn, { count: ratingCount })}
            </p>

            <div className="mt-5 space-y-2">
              {distribution.map((count, i) => {
                const star = 5 - i;
                const pct = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                const active = starFilter === star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarFilter(active ? null : star)}
                    aria-pressed={active}
                    className="flex w-full items-center gap-3 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-[#f5f5f7]"
                  >
                    <span className="w-10 shrink-0 text-xs text-[#6e6e73]">
                      {star} ★
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#ececee]">
                      <span
                        className={`block h-full rounded-full ${active ? "bg-[#6d28d9]" : "bg-[#7c3aed]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-8 shrink-0 text-right text-xs text-[#6e6e73]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls + list */}
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {starFilter ? (
                  <button
                    type="button"
                    onClick={() => setStarFilter(null)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#f3f0fe] px-3 py-1.5 text-xs font-semibold text-[#6d28d9]"
                  >
                    {starFilter} ★
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <span className="text-sm text-[#6e6e73]">{t.pdp.filterAll}</span>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-[#6e6e73]">
                {t.pdp.sortLabel}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-[#1d1d1f] focus:border-[#7c3aed] focus:outline-none"
                >
                  <option value="newest">{t.pdp.sortNewest}</option>
                  <option value="highest">{t.pdp.sortHighest}</option>
                  <option value="lowest">{t.pdp.sortLowest}</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
              {visible.map((review) => (
                <article
                  key={review.id}
                  className="rounded-lg border border-black/8 bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    {review.avatarUrl ? (
                      <img
                        src={review.avatarUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0fe] text-sm font-semibold text-[#7c3aed]">
                        {getInitials(review.author)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1d1d1f]">
                        {review.author}
                      </p>
                      <p className="text-xs text-[#9b9ba3]">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    {review.isVerified ? (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#16a34a]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {t.pdp.verified}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <Stars value={review.rating} />
                  </div>
                  {review.title ? (
                    <h3 className="mt-2 text-sm font-semibold text-[#1d1d1f]">
                      {review.title}
                    </h3>
                  ) : null}
                  {review.body ? (
                    <p className="mt-1.5 text-sm leading-7 text-[#3a3a42]">
                      {review.body}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
