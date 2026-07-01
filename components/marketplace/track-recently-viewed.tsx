"use client";

import { useEffect } from "react";

import type { ProductSummary } from "@/components/marketplace/types";
import {
  RECENTLY_VIEWED_KEY,
  RECENTLY_VIEWED_LIMIT,
  pushRecentlyViewed,
  useStoredList,
} from "@/lib/marketplace-storage";

/** Renders nothing — records this product as "recently viewed" on mount. */
export function TrackRecentlyViewed({ product }: { product: ProductSummary }) {
  const [, setItems] = useStoredList<ProductSummary>(RECENTLY_VIEWED_KEY);

  useEffect(() => {
    setItems((current) =>
      pushRecentlyViewed(current, product, RECENTLY_VIEWED_LIMIT),
    );
    // Only record once per mount (product identity change = new page).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
