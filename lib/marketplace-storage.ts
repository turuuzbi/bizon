"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { CartEntry, ProductSummary } from "@/components/marketplace/types";

export const WISHLIST_KEY = "erkas:wishlist";
export const COMPARE_KEY = "erkas:compare";
export const RECENTLY_VIEWED_KEY = "erkas:recently-viewed";
export const CART_KEY = "erkas:cart";

export const COMPARE_LIMIT = 4;
export const RECENTLY_VIEWED_LIMIT = 10;

// In-memory cache so useSyncExternalStore can return a stable reference per
// key between renders (it only re-renders when the cached value changes).
const cache = new Map<string, unknown[]>();
const EMPTY_LIST: never[] = [];

function eventName(key: string) {
  return `erkas-storage:${key}`;
}

function readFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function getSnapshot<T>(key: string): T[] {
  if (!cache.has(key)) {
    cache.set(key, readFromStorage<T>(key));
  }
  return cache.get(key) as T[];
}

function getServerSnapshot<T>(): T[] {
  return EMPTY_LIST as T[];
}

// "Have we mounted on the client yet?" without an effect+setState: the
// client snapshot (true) differs from the server snapshot (false), so
// useSyncExternalStore re-renders once right after hydration on its own.
function noopSubscribe() {
  return () => {};
}
function hydratedClientSnapshot() {
  return true;
}
function hydratedServerSnapshot() {
  return false;
}

function writeList<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(list));
  cache.set(key, list);
  window.dispatchEvent(new Event(eventName(key)));
}

function subscribe(key: string, callback: () => void) {
  function handleSameTab() {
    callback();
  }
  function handleOtherTab(event: StorageEvent) {
    if (event.key !== key) return;
    cache.set(key, readFromStorage(key));
    callback();
  }
  window.addEventListener(eventName(key), handleSameTab);
  window.addEventListener("storage", handleOtherTab);
  return () => {
    window.removeEventListener(eventName(key), handleSameTab);
    window.removeEventListener("storage", handleOtherTab);
  };
}

/**
 * Reads + subscribes to a localStorage-backed list. Updates propagate across
 * every component using the same key in the current tab (custom event) and
 * across tabs (native "storage" event), without any server/context plumbing.
 */
export function useStoredList<T>(key: string) {
  const items = useSyncExternalStore(
    (callback) => subscribe(key, callback),
    () => getSnapshot<T>(key),
    getServerSnapshot<T>,
  );

  // localStorage is only readable on the client; this flips to true right
  // after mount so callers can hold off rendering content until then and
  // avoid a hydration mismatch with the server-rendered (empty) markup.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    hydratedClientSnapshot,
    hydratedServerSnapshot,
  );

  const setList = useCallback(
    (next: T[] | ((current: T[]) => T[])) => {
      const current = getSnapshot<T>(key);
      const resolved =
        typeof next === "function" ? (next as (c: T[]) => T[])(current) : next;
      writeList(key, resolved);
    },
    [key],
  );

  return [items, setList, hydrated] as const;
}

export function toggleProductInList(
  list: ProductSummary[],
  product: ProductSummary,
  limit?: number,
) {
  const exists = list.some((item) => item.id === product.id);
  if (exists) {
    return list.filter((item) => item.id !== product.id);
  }
  const next = [product, ...list];
  return typeof limit === "number" ? next.slice(0, limit) : next;
}

export function pushRecentlyViewed(
  list: ProductSummary[],
  product: ProductSummary,
  limit: number,
) {
  const withoutCurrent = list.filter((item) => item.id !== product.id);
  return [product, ...withoutCurrent].slice(0, limit);
}

export function addToCart(
  list: CartEntry[],
  product: ProductSummary,
  quantity = 1,
) {
  const existing = list.find((entry) => entry.product.id === product.id);
  if (existing) {
    return list.map((entry) =>
      entry.product.id === product.id
        ? { ...entry, quantity: entry.quantity + quantity }
        : entry,
    );
  }
  return [{ product, quantity }, ...list];
}

export function removeFromCart(list: CartEntry[], productId: string) {
  return list.filter((entry) => entry.product.id !== productId);
}
