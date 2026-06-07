import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";

import { ProductDetail } from "./ProductDetail";
import {
  detectMediaKind,
  type PdpProduct,
  type PdpRelated,
  type PdpVariant,
} from "./types";

export const dynamic = "force-dynamic";

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function pickDefaultPrice(
  variants: { price: number; compareAtPrice: number | null; isDefault: boolean }[],
) {
  if (variants.length === 0) return null;
  return (
    [...variants].sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1))[0] ??
    null
  );
}

async function getProduct(slug: string): Promise<PdpProduct | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: "ACTIVE" },
      include: {
        brand: {
          select: {
            name: true,
            slug: true,
            logoUrl: true,
            description: true,
            websiteUrl: true,
          },
        },
        primaryCategory: { select: { name: true, slug: true } },
        productCategories: {
          orderBy: { sortOrder: "asc" },
          select: { category: { select: { name: true, slug: true } } },
        },
        images: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
          select: { url: true, altText: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          select: {
            id: true,
            title: true,
            sku: true,
            price: true,
            compareAtPrice: true,
            inventoryQuantity: true,
            trackInventory: true,
            allowBackorder: true,
            lowStockThreshold: true,
            isDefault: true,
            imageUrl: true,
            optionValues: {
              select: {
                optionValue: {
                  select: { value: true, option: { select: { name: true } } },
                },
              },
            },
          },
        },
        specifications: {
          orderBy: [{ position: "asc" }],
          select: {
            group: true,
            name: true,
            value: true,
            unit: true,
            isHighlighted: true,
          },
        },
      },
    });

    if (!product) return null;

    const seen = new Set<string>();
    const categories: { name: string; slug: string }[] = [];
    if (product.primaryCategory) {
      seen.add(product.primaryCategory.slug);
      categories.push(product.primaryCategory);
    }
    for (const pc of product.productCategories) {
      if (!seen.has(pc.category.slug)) {
        seen.add(pc.category.slug);
        categories.push(pc.category);
      }
    }

    const variants: PdpVariant[] = product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      price: toNumber(variant.price),
      compareAtPrice: toNullableNumber(variant.compareAtPrice),
      currency: product.currency,
      stock: variant.inventoryQuantity,
      trackInventory: variant.trackInventory,
      allowBackorder: variant.allowBackorder,
      lowStockThreshold: variant.lowStockThreshold,
      isDefault: variant.isDefault,
      options: variant.optionValues.map((ov) => ({
        name: ov.optionValue.option.name,
        value: ov.optionValue.value,
      })),
    }));

    const media = product.images.map((image) => ({
      url: image.url,
      altText: image.altText,
      kind: detectMediaKind(image.url),
    }));

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      shortDescription: product.shortDescription,
      description: product.description,
      baseUnit: product.baseUnit,
      currency: product.currency,
      trackInventory: product.trackInventory,
      allowBackorder: product.allowBackorder,
      isNewArrival: product.isNewArrival,
      isFeatured: product.isFeatured,
      brand: product.brand,
      primaryCategory: product.primaryCategory,
      categories,
      media,
      variants,
      specifications: product.specifications.map((spec) => ({
        name: spec.name,
        value: spec.value,
        group: spec.group?.trim() || "General",
        unit: spec.unit,
        highlighted: spec.isHighlighted,
      })),
      // No review model exists yet — surface an empty, gracefully-hidden state.
      reviews: [],
      ratingAverage: null,
      ratingCount: 0,
      ratingDistribution: [0, 0, 0, 0, 0],
    } satisfies PdpProduct;
  } catch {
    return null;
  }
}

async function getRelated(product: PdpProduct): Promise<PdpRelated[]> {
  try {
    const orFilters: Prisma.ProductWhereInput[] = [];
    if (product.primaryCategory) {
      orFilters.push({
        primaryCategory: { is: { slug: product.primaryCategory.slug } },
      });
    }
    if (product.brand) {
      orFilters.push({ brand: { is: { slug: product.brand.slug } } });
    }

    const where: Prisma.ProductWhereInput =
      orFilters.length > 0
        ? { status: "ACTIVE", id: { not: product.id }, OR: orFilters }
        : { status: "ACTIVE", id: { not: product.id } };

    const related = await prisma.product.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { isNewArrival: "desc" },
        { publishedAt: "desc" },
      ],
      take: 12,
      select: {
        id: true,
        name: true,
        slug: true,
        currency: true,
        brand: { select: { name: true } },
        images: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
          take: 1,
          select: { url: true, altText: true },
        },
        variants: {
          where: { isActive: true },
          select: { price: true, compareAtPrice: true, isDefault: true },
        },
      },
    });

    return related.map((item) => {
      const priced = pickDefaultPrice(
        item.variants.map((v) => ({
          price: toNumber(v.price),
          compareAtPrice: toNullableNumber(v.compareAtPrice),
          isDefault: v.isDefault,
        })),
      );
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        brandName: item.brand?.name ?? null,
        image: item.images[0] ?? null,
        price: priced?.price ?? null,
        compareAtPrice: priced?.compareAtPrice ?? null,
        currency: item.currency,
      } satisfies PdpRelated;
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: "ACTIVE" },
      select: {
        name: true,
        seoTitle: true,
        seoDescription: true,
        shortDescription: true,
        images: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
          take: 1,
          select: { url: true },
        },
      },
    });
    if (!product) return { title: "Product | Erka's" };
    const title = product.seoTitle?.trim() || `${product.name} | Erka's`;
    const description =
      product.seoDescription?.trim() ||
      product.shortDescription?.trim() ||
      undefined;
    const image = product.images[0]?.url;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return { title: "Product | Erka's" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelated(product);
  // Touch the dictionary so the locale is resolved at request time.
  getDictionary(locale);

  return (
    <main className="min-h-screen bg-white">
      <PublicHeader current="products" />
      <ProductDetail product={product} related={related} locale={locale} />
      <SiteFooter />
    </main>
  );
}
