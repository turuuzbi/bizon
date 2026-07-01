"use client";

import Link from "next/link";

import { useT } from "@/components/locale-provider";
import type { CartEntry } from "@/components/marketplace/types";
import { CART_KEY, removeFromCart, useStoredList } from "@/lib/marketplace-storage";

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

export function CartList() {
  const t = useT();
  const tc = t.marketplace.cart;
  const [entries, setEntries, hydrated] = useStoredList<CartEntry>(CART_KEY);

  if (!hydrated) return null;

  if (entries.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#d4d4d8] bg-[#f6f6f7] px-6 py-14 text-center">
        <h2 className="text-xl font-semibold text-[#18181b]">{tc.empty}</h2>
        <p className="mt-2 text-sm text-[#71717a]">{tc.emptyHint}</p>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-[8px] bg-[#8e55cf] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
        >
          {tc.browseCatalog}
        </Link>
      </div>
    );
  }

  function updateQuantity(productId: string, quantity: number) {
    setEntries((current) =>
      quantity <= 0
        ? removeFromCart(current, productId)
        : current.map((entry) =>
            entry.product.id === productId ? { ...entry, quantity } : entry,
          ),
    );
  }

  const totalItems = entries.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col divide-y divide-[#e4e4e7] rounded-[10px] border border-[#e4e4e7]">
        {entries.map((entry) => (
          <div key={entry.product.id} className="flex items-center gap-3 p-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e4e4e7] bg-[#f6f6f7]">
              {entry.product.imageUrl ? (
                <div
                  className="absolute inset-2 bg-no-repeat"
                  style={{
                    backgroundImage: `url("${entry.product.imageUrl}")`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                />
              ) : (
                <span className="text-sm font-semibold text-[#8e55cf]">
                  {getInitials(entry.product.name)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {entry.product.brand ? (
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
                  {entry.product.brand}
                </p>
              ) : null}
              <Link
                href={`/products/${entry.product.slug}`}
                className="line-clamp-1 text-sm font-medium text-[#18181b] hover:text-[#8e55cf]"
              >
                {entry.product.name}
              </Link>
              <p className="text-xs text-[#71717a]">{entry.product.unitLabel}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="-"
                onClick={() => updateQuantity(entry.product.id, entry.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#3f3f46] hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                −
              </button>
              <span className="w-6 text-center text-sm text-[#18181b]">{entry.quantity}</span>
              <button
                type="button"
                aria-label="+"
                onClick={() => updateQuantity(entry.product.id, entry.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#3f3f46] hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => setEntries((current) => removeFromCart(current, entry.product.id))}
              className="text-xs font-medium text-[#71717a] hover:text-[#dc2626]"
            >
              {tc.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 rounded-[10px] border border-[#e4e4e7] bg-[#f6f6f7] p-4 sm:flex-row sm:items-center">
        <span className="text-sm text-[#3f3f46]">
          {formatQty(tc.qty, totalItems)}
        </span>
        <button
          type="button"
          disabled
          title={tc.checkoutSoon}
          className="cursor-not-allowed rounded-[8px] bg-[#d4d4d8] px-5 py-2.5 text-sm font-semibold text-white"
        >
          {tc.checkout} · {tc.checkoutSoon}
        </button>
      </div>
    </div>
  );
}

function formatQty(label: string, count: number) {
  return `${label}: ${count}`;
}
