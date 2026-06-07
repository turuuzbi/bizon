"use client";

import Link from "next/link";
import { useTransition } from "react";

import { useLocale } from "@/components/locale-provider";
import { formatString, getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { formatPrice, getInitials } from "@/app/products/[slug]/types";
import type { CartLine } from "@/lib/cart";

import { removeCartItemAction, updateCartItemAction } from "./actions";

export function CartClient({
  items,
  subtotal,
  currency,
  locale,
}: {
  items: CartLine[];
  subtotal: number;
  currency: string;
  locale: Locale;
}) {
  const { locale: clientLocale } = useLocale();
  const t = getDictionary(clientLocale ?? locale);
  const [isPending, startTransition] = useTransition();

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  const setQty = (id: string, qty: number) =>
    startTransition(() => {
      void updateCartItemAction(id, qty);
    });
  const remove = (id: string) =>
    startTransition(() => {
      void removeCartItemAction(id);
    });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Lines */}
      <ul className="divide-y divide-black/8 rounded-lg border border-black/8 bg-white">
        {items.map((line) => {
          const atMax = line.maxQuantity !== null && line.quantity >= line.maxQuantity;
          return (
            <li key={line.id} className="flex gap-4 p-4 sm:p-5">
              <Link
                href={`/products/${line.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-black/8 bg-[#f5f5f7]"
              >
                {line.image ? (
                  <img
                    src={line.image}
                    alt={line.name}
                    loading="lazy"
                    className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] object-contain"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold uppercase tracking-[0.1em] text-[#7c3aed]">
                    {getInitials(line.name)}
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${line.slug}`}
                      className="line-clamp-2 text-sm font-semibold text-[#1d1d1f] hover:text-[#7c3aed]"
                    >
                      {line.name}
                    </Link>
                    {line.variantTitle ? (
                      <p className="mt-0.5 text-xs text-[#9b9ba3]">{line.variantTitle}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-[#6e6e73]">
                      {formatPrice(line.unitPrice, currency)} {t.cart.each}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[#1d1d1f]">
                    {formatPrice(line.lineTotal, currency)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
                    <button
                      type="button"
                      onClick={() => setQty(line.id, line.quantity - 1)}
                      disabled={isPending}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-40"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14" /></svg>
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-[#1d1d1f]">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(line.id, line.quantity + 1)}
                      disabled={isPending || atMax}
                      aria-label="Increase quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-40"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    disabled={isPending}
                    className="text-xs font-medium text-[#6e6e73] transition-colors hover:text-[#dc2626] disabled:opacity-40"
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside className="h-fit rounded-lg border border-black/8 bg-white p-6 lg:sticky lg:top-6">
        <div className="flex items-center justify-between text-sm text-[#6e6e73]">
          <span>{formatString(t.cart.itemCount, { count: itemCount })}</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-black/8 pt-4">
          <span className="text-sm font-semibold text-[#1d1d1f]">{t.cart.subtotal}</span>
          <span className="font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
            {formatPrice(subtotal, currency)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
        >
          {t.cart.checkout}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </Link>
        <Link
          href="/products"
          className="mt-3 flex w-full items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium text-[#6e6e73] transition-colors hover:text-[#7c3aed]"
        >
          {t.cart.continue}
        </Link>
      </aside>
    </div>
  );
}
