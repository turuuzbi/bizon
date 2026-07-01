"use client";

import Link from "next/link";

import { useT } from "@/components/locale-provider";
import { formatString } from "@/lib/i18n";
import type { ProductSummary } from "@/components/marketplace/types";
import { COMPARE_KEY, useStoredList } from "@/lib/marketplace-storage";

export function CompareBar() {
  const t = useT();
  const [items, setItems] = useStoredList<ProductSummary>(COMPARE_KEY);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e4e4e7] bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(24,24,27,0.08)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-340 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[#e4e4e7] bg-[#f6f6f7]"
              title={item.name}
            >
              {item.imageUrl ? (
                <div
                  className="h-full w-full bg-no-repeat"
                  style={{
                    backgroundImage: `url("${item.imageUrl}")`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                />
              ) : (
                <span className="text-[10px] font-semibold text-[#8e55cf]">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setItems([])}
            className="text-xs font-medium text-[#71717a] hover:text-[#18181b]"
          >
            {t.marketplace.compare.clear}
          </button>
          <Link
            href="/compare"
            className="rounded-[8px] bg-[#8e55cf] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
          >
            {formatString(t.marketplace.compare.bar, { count: items.length })}
          </Link>
        </div>
      </div>
    </div>
  );
}
