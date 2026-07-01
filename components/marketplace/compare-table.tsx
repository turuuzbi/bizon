"use client";

import Link from "next/link";

import { useT } from "@/components/locale-provider";
import type { ProductSummary } from "@/components/marketplace/types";
import { COMPARE_KEY, toggleProductInList, useStoredList } from "@/lib/marketplace-storage";

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

export function CompareTable() {
  const t = useT();
  const tc = t.marketplace.compare;
  const [items, setItems, hydrated] = useStoredList<ProductSummary>(COMPARE_KEY);

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#d4d4d8] bg-[#f6f6f7] px-6 py-14 text-center">
        <h2 className="text-xl font-semibold text-[#18181b]">{tc.empty}</h2>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-[8px] bg-[#8e55cf] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
        >
          {tc.backToCatalog}
        </Link>
      </div>
    );
  }

  const rows: Array<{ label: string; render: (item: ProductSummary) => string }> = [
    { label: tc.colBrand, render: (item) => item.brand ?? "—" },
    { label: tc.colCategory, render: (item) => item.categoryName ?? "—" },
    { label: tc.colUnit, render: (item) => item.unitLabel },
    {
      label: tc.colAvailability,
      render: (item) => (item.inStock ? t.marketplace.card.inStock : t.marketplace.card.outOfStock),
    },
    { label: tc.colSku, render: (item) => item.sku ?? "—" },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setItems([])}
          className="text-sm font-medium text-[#71717a] hover:text-[#18181b]"
        >
          {tc.clear}
        </button>
      </div>
      <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-[10px] border border-[#e4e4e7] text-sm">
        <thead>
          <tr>
            <th className="w-32 bg-[#f6f6f7] p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71717a]" />
            {items.map((item) => (
              <th key={item.id} className="border-l border-[#e4e4e7] bg-[#f6f6f7] p-3 text-left align-top">
                <div className="flex flex-col gap-2">
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[8px] border border-[#e4e4e7] bg-white">
                    {item.imageUrl ? (
                      <div
                        className="absolute inset-2 bg-no-repeat"
                        style={{
                          backgroundImage: `url("${item.imageUrl}")`,
                          backgroundPosition: "center",
                          backgroundSize: "contain",
                        }}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[#8e55cf]">
                        {getInitials(item.name)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 text-sm font-medium text-[#18181b] hover:text-[#8e55cf]"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setItems((current) => toggleProductInList(current, item))}
                    className="self-start text-xs font-medium text-[#71717a] hover:text-[#dc2626]"
                  >
                    {tc.remove}
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th className="border-t border-[#e4e4e7] bg-[#f6f6f7] p-3 text-left text-xs font-semibold uppercase tracking-wide text-[#71717a]">
                {row.label}
              </th>
              {items.map((item) => (
                <td
                  key={item.id}
                  className="border-l border-t border-[#e4e4e7] p-3 text-[#3f3f46]"
                >
                  {row.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
