"use client";

import { useMemo, useState } from "react";

import { useLocale } from "@/components/locale-provider";
import { getDictionary } from "@/lib/i18n";
import type { PdpSpec } from "./types";

const COLLAPSE_THRESHOLD = 12;
const COLLAPSED_VISIBLE = 8;

export function SpecsSection({ attributes }: { attributes: PdpSpec[] }) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attributes;
    return attributes.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.value.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q),
    );
  }, [attributes, query]);

  const visible =
    expanded || query.trim() ? filtered : filtered.slice(0, COLLAPSED_VISIBLE);

  const groups = useMemo(() => {
    const map = new Map<string, PdpSpec[]>();
    for (const attribute of visible) {
      const list = map.get(attribute.group) ?? [];
      list.push(attribute);
      map.set(attribute.group, list);
    }
    return [...map.entries()];
  }, [visible]);

  const showSearch = attributes.length > COLLAPSE_THRESHOLD;
  const canCollapse =
    !query.trim() && attributes.length > COLLAPSED_VISIBLE;

  return (
    <section aria-labelledby="specs-heading" className="scroll-mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="specs-heading"
          className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl"
        >
          {t.pdp.specsTitle}
        </h2>
        {showSearch ? (
          <div className="relative w-full sm:w-72">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b9ba3]"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.pdp.specsSearch}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1d1d1f] placeholder:text-[#9b9ba3] focus:border-[#7c3aed] focus:outline-none"
            />
          </div>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-black/10 bg-[#f5f5f7] px-5 py-8 text-center text-sm text-[#6e6e73]">
          {t.pdp.specsNone}
        </p>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {groups.map(([group, rows]) => (
            <div
              key={group}
              className="overflow-hidden rounded-lg border border-black/8 bg-white"
            >
              <p className="border-b border-black/8 bg-[#f5f5f7] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6d28d9]">
                {group}
              </p>
              <dl className="divide-y divide-black/6">
                {rows.map((row, i) => (
                  <div
                    key={`${row.name}-${i}`}
                    className="grid grid-cols-[40%_60%] gap-3 px-5 py-3"
                  >
                    <dt className="text-sm text-[#6e6e73]">{row.name}</dt>
                    <dd className="text-sm font-medium text-[#1d1d1f]">
                      {row.unit ? `${row.value} ${row.unit}` : row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}

      {canCollapse ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
        >
          {expanded ? t.pdp.showLess : t.pdp.showAll}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      ) : null}
    </section>
  );
}
