// Shared, serializable PDP types + pure formatting helpers.
// No "use client" — imported by both the server page and client components.
// Money values are major units (e.g. ₮ amounts), matching ProductVariant.price
// which is a Decimal(12,2), already converted to a number on the server.

export type PdpMedia = {
  url: string;
  altText: string | null;
  kind: "image" | "video";
};

export type PdpVariant = {
  id: string;
  title: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  lowStockThreshold: number | null;
  isDefault: boolean;
  options: { name: string; value: string }[];
};

export type PdpSpec = {
  name: string;
  value: string;
  group: string;
  unit: string | null;
  highlighted: boolean;
};

export type PdpReview = {
  id: string;
  author: string;
  avatarUrl: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  isVerified: boolean;
  createdAt: string; // ISO
};

export type PdpRelated = {
  id: string;
  name: string;
  slug: string;
  brandName: string | null;
  image: { url: string; altText: string | null } | null;
  price: number | null;
  compareAtPrice: number | null;
  currency: string;
};

export type PdpProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  baseUnit: string;
  currency: string;
  trackInventory: boolean;
  allowBackorder: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  brand: {
    name: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    websiteUrl: string | null;
  } | null;
  primaryCategory: { name: string; slug: string } | null;
  categories: { name: string; slug: string }[];
  media: PdpMedia[];
  variants: PdpVariant[];
  specifications: PdpSpec[];
  reviews: PdpReview[];
  ratingAverage: number | null;
  ratingCount: number;
  /** [5★, 4★, 3★, 2★, 1★] counts */
  ratingDistribution: number[];
};

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatPrice(amount: number, currency: string) {
  const formatted = numberFormatter.format(Math.round(amount));
  return currency === "MNT" || currency === "₮"
    ? `₮${formatted}`
    : `${currency} ${formatted}`;
}

export function getInitials(name: string) {
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

export function discountPercent(
  price: number | null | undefined,
  compareAtPrice: number | null | undefined,
) {
  if (
    typeof price !== "number" ||
    typeof compareAtPrice !== "number" ||
    compareAtPrice <= price
  ) {
    return 0;
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function detectMediaKind(url: string): PdpMedia["kind"] {
  return /\.(mp4|webm|mov|ogg|m4v)(\?|#|$)/i.test(url) ? "video" : "image";
}
