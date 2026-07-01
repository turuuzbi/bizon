"use client";

import Link from "next/link";

import { useT } from "@/components/locale-provider";
import type { CartEntry, ProductSummary } from "@/components/marketplace/types";
import { CART_KEY, WISHLIST_KEY, useStoredList } from "@/lib/marketplace-storage";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8e55cf] px-1 text-[10px] font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function HeaderActionBadges({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const [wishlist] = useStoredList<ProductSummary>(WISHLIST_KEY);
  const [cart] = useStoredList<CartEntry>(CART_KEY);
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  const size = compact ? "h-9 w-9" : "h-10 w-10";

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/wishlist"
        aria-label={t.header.favorites}
        className={`relative flex ${size} items-center justify-center rounded-full border border-[#e4e4e7] text-[#18181b] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px]"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <CountBadge count={wishlist.length} />
      </Link>
      <Link
        href="/cart"
        aria-label={t.header.cart}
        className={`relative flex ${size} items-center justify-center rounded-full bg-[#8e55cf] text-white transition-colors hover:bg-[#7d45c1]`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px]"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <CountBadge count={cartCount} />
      </Link>
    </div>
  );
}
