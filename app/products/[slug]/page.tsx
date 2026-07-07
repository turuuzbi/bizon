import { notFound } from "next/navigation";
import { ProductStatus } from "@prisma/client";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs";
import { DeliveryInfo } from "@/components/marketplace/delivery-info";
import { ProductDetailActions } from "@/components/marketplace/product-detail-actions";
import { ProductGallery } from "@/components/marketplace/product-gallery";
import { ProductRail } from "@/components/marketplace/product-rail";
import { RecentlyViewedRail } from "@/components/marketplace/recently-viewed-rail";
import { TrackRecentlyViewed } from "@/components/marketplace/track-recently-viewed";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";
import type { ProductSummary } from "@/components/marketplace/types";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isInStock(
  variants: Array<{
    inventoryQuantity: number;
    trackInventory: boolean;
    allowBackorder: boolean;
  }>,
) {
  if (variants.length === 0) return true;
  return variants.some(
    (variant) =>
      !variant.trackInventory || variant.allowBackorder || variant.inventoryQuantity > 0,
  );
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: ProductStatus.ACTIVE },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      shortDescription: true,
      description: true,
      baseUnit: true,
      isFeatured: true,
      isNewArrival: true,
      brand: { select: { name: true, slug: true } },
      primaryCategory: {
        select: { id: true, name: true, slug: true, parent: { select: { name: true, slug: true } } },
      },
      productCategories: {
        orderBy: { sortOrder: "asc" },
        select: { category: { select: { name: true, slug: true } } },
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        select: { url: true, altText: true },
      },
      specifications: {
        orderBy: [{ group: "asc" }, { position: "asc" }],
        select: { group: true, name: true, value: true, unit: true },
      },
      variants: {
        where: { isActive: true },
        select: { inventoryQuantity: true, trackInventory: true, allowBackorder: true },
      },
    },
  });
}

async function getRelatedProducts(categorySlug: string | undefined, excludeId: string) {
  if (!categorySlug) return [];
  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      id: { not: excludeId },
      OR: [
        { primaryCategory: { slug: categorySlug } },
        { productCategories: { some: { category: { slug: categorySlug } } } },
      ],
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      baseUnit: true,
      isFeatured: true,
      isNewArrival: true,
      brand: { select: { name: true } },
      primaryCategory: { select: { name: true, slug: true } },
      productCategories: {
        select: { category: { select: { name: true, slug: true } } },
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        take: 1,
        select: { url: true, altText: true },
      },
      variants: {
        where: { isActive: true },
        select: { inventoryQuantity: true, trackInventory: true, allowBackorder: true },
      },
    },
  });
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { slug } = await params;

  const product = await getProduct(slug);
  if (!product) notFound();

  const unitLabel = (unit: string) => t.unit[unit] ?? toTitleCase(unit);
  const category =
    product.primaryCategory ?? product.productCategories[0]?.category ?? null;
  const inStock = isInStock(product.variants);

  const summary: ProductSummary = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand?.name ?? null,
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    unitLabel: unitLabel(product.baseUnit),
    imageUrl: product.images[0]?.url ?? null,
    imageAlt: product.images[0]?.altText ?? null,
    inStock,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    sku: product.sku,
  };

  const related = await getRelatedProducts(category?.slug, product.id);
  const relatedSummaries: ProductSummary[] = related.map((item) => {
    const itemCategory =
      item.primaryCategory ?? item.productCategories[0]?.category ?? null;
    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      brand: item.brand?.name ?? null,
      categoryName: itemCategory?.name ?? null,
      categorySlug: itemCategory?.slug ?? null,
      unitLabel: unitLabel(item.baseUnit),
      imageUrl: item.images[0]?.url ?? null,
      imageAlt: item.images[0]?.altText ?? null,
      inStock: isInStock(item.variants),
      isFeatured: item.isFeatured,
      isNewArrival: item.isNewArrival,
      sku: item.sku,
    };
  });

  const breadcrumbItems: BreadcrumbItem[] = [{ label: t.breadcrumbs.home, href: "/" }];
  breadcrumbItems.push({ label: t.breadcrumbs.catalog, href: "/products" });
  if (product.primaryCategory?.parent) {
    breadcrumbItems.push({
      label: product.primaryCategory.parent.name,
      href: `/products?category=${product.primaryCategory.parent.slug}`,
    });
  }
  if (category) {
    breadcrumbItems.push({
      label: category.name,
      href: `/products?category=${category.slug}`,
    });
  }
  breadcrumbItems.push({ label: product.name });

  const specGroups = new Map<string, typeof product.specifications>();
  for (const spec of product.specifications) {
    const key = spec.group ?? t.marketplace.productDetail.specsTitle;
    specGroups.set(key, [...(specGroups.get(key) ?? []), spec]);
  }

  return (
    <main className="min-h-screen bg-white">
      <PublicHeader current="products" />
      <TrackRecentlyViewed product={summary} />

      <div className="mx-auto w-full max-w-340 px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col gap-3">
            {product.brand ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-[#a1a1aa]">
                {product.brand.name}
              </p>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight text-[#18181b] sm:text-[32px]">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#71717a]">
              {category ? <span>{category.name}</span> : null}
              {category ? <span aria-hidden>·</span> : null}
              <span>{unitLabel(product.baseUnit)}</span>
              {product.sku ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{t.products.sku}: {product.sku}</span>
                </>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {product.isNewArrival ? (
                <span className="rounded-[6px] bg-[#16a34a] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {t.marketplace.card.newBadge}
                </span>
              ) : null}
              {product.isFeatured ? (
                <span className="rounded-[6px] bg-[#8e55cf] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {t.marketplace.card.featuredBadge}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${inStock ? "bg-[#16a34a]" : "bg-[#dc2626]"}`}
                  aria-hidden
                />
                <span className={inStock ? "text-[#16a34a]" : "text-[#dc2626]"}>
                  {inStock ? t.marketplace.card.inStock : t.marketplace.card.outOfStock}
                </span>
              </span>
            </div>

            {product.shortDescription ? (
              <p className="text-sm leading-6 text-[#3f3f46]">
                {product.shortDescription}
              </p>
            ) : null}

            <div className="mt-1">
              <ProductDetailActions product={summary} />
            </div>

            <DeliveryInfo strings={t.marketplace.delivery} />
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div />
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-lg font-semibold text-[#18181b]">
                {t.marketplace.productDetail.descriptionTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#3f3f46]">
                {product.description?.trim() || t.marketplace.productDetail.noDescription}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#18181b]">
                {t.marketplace.productDetail.specsTitle}
              </h2>
              {specGroups.size > 0 ? (
                <div className="mt-3 flex flex-col gap-4">
                  {[...specGroups.entries()].map(([group, specs]) => (
                    <div key={group}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#a1a1aa]">
                        {group}
                      </p>
                      <dl className="mt-1.5 divide-y divide-[#e4e4e7] rounded-[10px] border border-[#e4e4e7]">
                        {specs.map((spec) => (
                          <div
                            key={`${spec.name}-${spec.value}`}
                            className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                          >
                            <dt className="text-[#71717a]">{spec.name}</dt>
                            <dd className="font-medium text-[#18181b]">
                              {spec.value}
                              {spec.unit ? ` ${spec.unit}` : ""}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#71717a]">
                  {t.marketplace.productDetail.noSpecs}
                </p>
              )}
            </section>
          </div>
        </div>

        <ProductRail
          title={t.marketplace.productDetail.relatedTitle}
          products={relatedSummaries}
        />

        <RecentlyViewedRail excludeId={product.id} />
      </div>

      <SiteFooter />
    </main>
  );
}
