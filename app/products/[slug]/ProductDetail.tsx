"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { addToCartAction, buyNowAction } from "@/app/cart/actions";
import { useLocale } from "@/components/locale-provider";
import { formatString, getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

import { ProductGallery } from "./ProductGallery";
import { RecentlyViewed } from "./RecentlyViewed";
import { RelatedProducts } from "./RelatedProducts";
import { ReviewsSection } from "./ReviewsSection";
import { SpecsSection } from "./SpecsSection";
import {
  discountPercent,
  formatPrice,
  type PdpProduct,
  type PdpRelated,
} from "./types";
import { useWishlist } from "./useWishlist";

function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(value);
        return (
          <svg key={i} viewBox="0 0 24 24" className={className} fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "#d4d4d8"} strokeWidth="1.6" strokeLinejoin="round">
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9z" />
          </svg>
        );
      })}
    </span>
  );
}

type Availability = {
  tone: "ok" | "low" | "out" | "na";
  label: string;
  purchasable: boolean;
};

export function ProductDetail({
  product,
  related,
  locale,
}: {
  product: PdpProduct;
  related: PdpRelated[];
  locale: Locale;
}) {
  const { locale: clientLocale } = useLocale();
  const t = getDictionary(clientLocale ?? locale);

  const variants = product.variants;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { wishlisted, toggle: toggleWishlist } = useWishlist(product.slug);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;

  const price = selectedVariant?.price ?? null;
  const compareAt = selectedVariant?.compareAtPrice ?? null;
  const currency = selectedVariant?.currency ?? product.currency;
  const pct = discountPercent(price, compareAt);

  const availability: Availability = useMemo(() => {
    if (!selectedVariant) {
      return { tone: "na", label: t.pdp.unavailable, purchasable: false };
    }
    const { stock, trackInventory, allowBackorder, lowStockThreshold } =
      selectedVariant;
    if (!trackInventory) {
      return { tone: "ok", label: t.pdp.inStock, purchasable: true };
    }
    if (stock > 0) {
      const threshold = lowStockThreshold ?? 5;
      if (stock <= threshold) {
        return {
          tone: "low",
          label: formatString(t.pdp.lowStock, { n: stock }),
          purchasable: true,
        };
      }
      return { tone: "ok", label: t.pdp.inStock, purchasable: true };
    }
    if (allowBackorder) {
      return { tone: "ok", label: t.pdp.backorder, purchasable: true };
    }
    return { tone: "out", label: t.pdp.outOfStock, purchasable: false };
  }, [selectedVariant, t]);

  const maxQty =
    selectedVariant && selectedVariant.trackInventory && !selectedVariant.allowBackorder
      ? Math.max(1, selectedVariant.stock)
      : 99;

  const highlighted = product.specifications.filter((s) => s.highlighted);
  const highlights =
    highlighted.length > 0
      ? highlighted.slice(0, 6)
      : product.specifications.length > 4
        ? product.specifications.slice(0, 4)
        : [];

  const descriptionParagraphs = (product.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const descriptionLong =
    (product.description ?? "").length > 700 || descriptionParagraphs.length > 4;

  const unitLabel = t.unit[product.baseUnit] ?? null;

  function selectVariant(id: string) {
    setSelectedVariantId(id);
    setQuantity(1);
  }

  function addToCart() {
    if (!availability.purchasable || !selectedVariant) return;
    startTransition(async () => {
      const result = await addToCartAction(
        product.id,
        selectedVariant.id,
        quantity,
      );
      if (result?.ok) {
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }
    });
  }

  function buyNow() {
    if (!availability.purchasable || !selectedVariant) return;
    startTransition(async () => {
      // Adds to cart then redirects to checkout (server-side).
      await buyNowAction(product.id, selectedVariant.id, quantity);
    });
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  const toneClass =
    availability.tone === "out" || availability.tone === "na"
      ? "text-[#dc2626]"
      : "text-[#16a34a]";

  const priceBlock = (
    <div>
      {price !== null ? (
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-[family:var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
            {formatPrice(price, currency)}
          </span>
          {compareAt !== null && pct > 0 ? (
            <>
              <span className="text-lg text-[#a59bab] line-through">
                {formatPrice(compareAt, currency)}
              </span>
              <span className="rounded-lg bg-[#f3f0fe] px-2.5 py-1 text-xs font-semibold text-[#6d28d9]">
                {formatString(t.pdp.save, { pct })}
              </span>
            </>
          ) : null}
          {unitLabel ? (
            <span className="text-sm text-[#9b9ba3]">/ {unitLabel}</span>
          ) : null}
        </div>
      ) : (
        <span className="font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
          {t.pdp.unavailable}
        </span>
      )}
    </div>
  );

  const quantityStepper = (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M5 12h14" /></svg>
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-[#1d1d1f]" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
        disabled={quantity >= maxQty}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    </div>
  );

  const addToCartButton = (
    <button
      type="button"
      onClick={addToCart}
      disabled={!availability.purchasable || isPending}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        added ? "bg-[#16a34a] text-white" : "bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
      }`}
    >
      {added ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 6 9 17l-5-5" /></svg>
          {t.pdp.added}
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {t.pdp.addToCart}
        </>
      )}
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-340 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-[#9b9ba3]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[#7c3aed]">{t.pdp.home}</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/products" className="hover:text-[#7c3aed]">{t.pdp.allProducts}</Link>
          </li>
          {product.primaryCategory ? (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/products?category=${product.primaryCategory.slug}`}
                  className="hover:text-[#7c3aed]"
                >
                  {product.primaryCategory.name}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden>/</li>
          <li className="truncate font-medium text-[#1d1d1f]">{product.name}</li>
        </ol>
      </nav>

      {/* Above the fold */}
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
        {/* Gallery */}
        <div className="md:col-span-1 lg:col-span-5">
          <ProductGallery
            media={product.media}
            name={product.name}
            isNew={product.isNewArrival}
            newLabel={t.productsPage.badgeNew}
            discountLabel={pct > 0 ? `-${pct}%` : null}
          />
        </div>

        {/* Info */}
        <div className="md:col-span-1 lg:col-span-4">
          {product.brand ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7c3aed]">
              {product.brand.name}
            </p>
          ) : null}
          <h1 className="mt-2 font-[family:var(--font-display)] text-3xl leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {product.ratingCount > 0 && product.ratingAverage !== null ? (
              <a href="#reviews-heading" className="flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#7c3aed]">
                <Stars value={product.ratingAverage} />
                <span className="font-medium">{product.ratingAverage.toFixed(1)}</span>
                <span className="text-[#9b9ba3]">
                  ({product.ratingCount})
                </span>
              </a>
            ) : null}
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${toneClass}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {availability.label}
            </span>
            {product.sku ? (
              <span className="text-xs text-[#9b9ba3]">{t.products.sku}: {product.sku}</span>
            ) : null}
          </div>

          {/* Price (mobile/tablet — purchase panel carries it on desktop) */}
          <div className="mt-5 lg:hidden">{priceBlock}</div>

          {product.shortDescription ? (
            <p className="mt-5 text-base leading-7 text-[#3a3a42]">
              {product.shortDescription}
            </p>
          ) : null}

          {/* Variant selector */}
          {variants.length > 1 ? (
            <div className="mt-6">
              <p className="text-sm font-semibold text-[#1d1d1f]">{t.pdp.options}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const active = variant.id === selectedVariant?.id;
                  const soldOut =
                    variant.trackInventory &&
                    !variant.allowBackorder &&
                    variant.stock <= 0;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => selectVariant(variant.id)}
                      aria-pressed={active}
                      className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? "border-[#7c3aed] bg-[#f3f0fe] text-[#1d1d1f] ring-1 ring-[#7c3aed]"
                          : "border-black/10 bg-white text-[#3a3a42] hover:border-[#7c3aed]/50"
                      } ${soldOut ? "opacity-50" : ""}`}
                    >
                      <span className="block font-medium">{variant.title}</span>
                      {variant.options.length > 0 ? (
                        <span className="mt-0.5 block text-xs text-[#9b9ba3]">
                          {variant.options.map((o) => o.value).join(" · ")}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Highlights (compact, in-column) */}
          {highlights.length > 0 ? (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {highlights.map((spec, i) => (
                <li key={`${spec.name}-${i}`} className="flex items-start gap-2 text-sm text-[#3a3a42]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
                  <span>
                    <span className="text-[#9b9ba3]">{spec.name}: </span>
                    <span className="font-medium text-[#1d1d1f]">
                      {spec.unit ? `${spec.value} ${spec.unit}` : spec.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Delivery line */}
          <div className="mt-6 flex items-center gap-2 text-sm text-[#6e6e73]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#7c3aed]">
              <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            {t.pdp.deliveryCopy}
          </div>
        </div>

        {/* Purchase panel */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="rounded-lg border border-black/8 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            {priceBlock}

            <p className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${toneClass}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {availability.label}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#1d1d1f]">{t.pdp.quantity}</span>
              {quantityStepper}
            </div>

            <div className="mt-5 flex gap-3">{addToCartButton}</div>

            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={buyNow}
                disabled={!availability.purchasable || isPending}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#1d1d1f] bg-[#1d1d1f] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t.pdp.buyNow}
              </button>
              <button
                type="button"
                onClick={toggleWishlist}
                aria-pressed={wishlisted}
                aria-label={wishlisted ? t.pdp.wishlistRemove : t.pdp.wishlistAdd}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  wishlisted
                    ? "border-[#7c3aed] bg-[#f3f0fe] text-[#7c3aed]"
                    : "border-black/10 bg-white text-[#1d1d1f] hover:border-[#7c3aed] hover:text-[#7c3aed]"
                }`}
              >
                <svg viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={share}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#6e6e73] transition-colors hover:text-[#7c3aed]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
              </svg>
              {copied ? t.pdp.shareCopied : t.pdp.share}
            </button>

            <div className="mt-6 space-y-4 border-t border-black/8 pt-6">
              {[
                { title: t.pdp.deliveryTitle, copy: t.pdp.deliveryCopy, icon: "M1 3h15v13H1z M16 8h4l3 3v5h-7z" },
                { title: t.pdp.returnsTitle, copy: t.pdp.returnsCopy, icon: "M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8 M3 3v5h5" },
                { title: t.pdp.secureTitle, copy: t.pdp.secureCopy, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" },
              ].map((row) => (
                <div key={row.title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f0fe] text-[#7c3aed]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d={row.icon} />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">{row.title}</p>
                    <p className="text-xs leading-5 text-[#6e6e73]">{row.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            {product.brand ? (
              <div className="mt-6 flex items-center gap-3 border-t border-black/8 pt-6">
                {product.brand.logoUrl ? (
                  <img src={product.brand.logoUrl} alt={product.brand.name} loading="lazy" className="h-9 w-9 rounded-lg object-contain" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f5f7] text-sm font-semibold text-[#7c3aed]">
                    {product.brand.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[#9b9ba3]">{t.pdp.soldBy}</p>
                  <p className="text-sm font-semibold text-[#1d1d1f]">{product.brand.name}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
        {descriptionParagraphs.length > 0 ? (
          <section aria-labelledby="description-heading">
            <h2
              id="description-heading"
              className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl"
            >
              {t.pdp.descriptionTitle}
            </h2>
            <div className="relative mt-5">
              <div
                className={`max-w-3xl space-y-4 text-base leading-8 text-[#3a3a42] ${
                  descriptionLong && !descExpanded ? "max-h-72 overflow-hidden" : ""
                }`}
              >
                {descriptionParagraphs.map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </div>
              {descriptionLong && !descExpanded ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
              ) : null}
            </div>
            {descriptionLong ? (
              <button
                type="button"
                onClick={() => setDescExpanded((v) => !v)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
              >
                {descExpanded ? t.pdp.readLess : t.pdp.readMore}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 transition-transform ${descExpanded ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
              </button>
            ) : null}
          </section>
        ) : null}

        {product.specifications.length > 0 ? (
          <SpecsSection attributes={product.specifications} />
        ) : null}

        {product.ratingCount > 0 ? (
          <ReviewsSection
            reviews={product.reviews}
            ratingAverage={product.ratingAverage}
            ratingCount={product.ratingCount}
            distribution={product.ratingDistribution}
          />
        ) : null}

        <RelatedProducts related={related} />

        <RecentlyViewed
          current={{
            slug: product.slug,
            name: product.name,
            image: product.media.find((m) => m.kind === "image")?.url ?? null,
            price,
            currency,
            brandName: product.brand?.name ?? null,
          }}
        />
      </div>

      {/* Mobile sticky purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-340 items-center gap-3">
          <div className="min-w-0">
            {price !== null ? (
              <p className="truncate text-lg font-bold text-[#1d1d1f]">
                {formatPrice(price, currency)}
              </p>
            ) : (
              <p className="truncate text-sm font-semibold text-[#6e6e73]">
                {t.pdp.unavailable}
              </p>
            )}
            <p className={`truncate text-xs font-medium ${toneClass}`}>{availability.label}</p>
          </div>
          <div className="flex flex-1 justify-end">{addToCartButton}</div>
        </div>
      </div>

      {/* Accessible live region for optimistic actions */}
      <p className="sr-only" role="status" aria-live="polite">
        {added ? t.pdp.added : copied ? t.pdp.shareCopied : ""}
      </p>
    </div>
  );
}
