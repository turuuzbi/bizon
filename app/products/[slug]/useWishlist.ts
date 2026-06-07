"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "erkas:wishlist";

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Lightweight, dependency-free wishlist persisted to localStorage. Returns the
 * current saved state for `slug` plus an optimistic toggle.
 */
export function useWishlist(slug: string) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(readWishlist().includes(slug));
  }, [slug]);

  const toggle = useCallback(() => {
    setWishlisted((current) => {
      const next = !current;
      try {
        const list = readWishlist().filter((s) => s !== slug);
        if (next) list.unshift(slug);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch {
        /* ignore quota / serialization errors */
      }
      return next;
    });
  }, [slug]);

  return { wishlisted, toggle };
}
