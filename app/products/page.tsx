import Link from "next/link";
import { Prisma, ProductStatus } from "@prisma/client";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { formatString, getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";

type SearchParamValue = string | string[] | undefined;

type ProductsPageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

type ProductsFilterState = {
  q: string;
  category: string;
  sort: string;
};

type ProductCard = Awaited<ReturnType<typeof getProducts>>[number];

const SORT_VALUES = ["featured", "newest", "name-asc", "name-desc"] as const;
type SortValue = (typeof SORT_VALUES)[number];

export async function generateMetadata() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return {
    title: t.productsPage.metaTitle,
    description: t.productsPage.metaDescription,
  };
}

function getSingleSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function formatDate(value: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "mn" ? "mn-MN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function summarizeText(product: ProductCard, fallback: string) {
  const source =
    product.shortDescription?.trim() || product.description?.trim() || "";
  if (!source) return fallback;
  return source.length > 120 ? `${source.slice(0, 117).trim()}...` : source;
}

function buildProductsHref(
  filters: ProductsFilterState,
  overrides: Partial<ProductsFilterState>,
) {
  const params = new URLSearchParams();
  const merged = { ...filters, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    const trimmed = value.trim();
    if (trimmed) params.set(key, trimmed);
  }
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

function getProductCategories(product: ProductCard) {
  const uniqueCategories = new Map<string, { name: string; slug: string }>();
  if (product.primaryCategory) {
    uniqueCategories.set(product.primaryCategory.slug, {
      name: product.primaryCategory.name,
      slug: product.primaryCategory.slug,
    });
  }
  for (const entry of product.productCategories) {
    uniqueCategories.set(entry.category.slug, {
      name: entry.category.name,
      slug: entry.category.slug,
    });
  }
  return [...uniqueCategories.values()];
}

function getProductImage(product: ProductCard) {
  return product.images[0] ?? null;
}

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

function getProductOrderBy(sort: string): Prisma.ProductOrderByWithRelationInput[] {
  if (sort === "newest") return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  if (sort === "name-asc") return [{ name: "asc" }];
  if (sort === "name-desc") return [{ name: "desc" }];
  return [
    { isFeatured: "desc" },
    { isNewArrival: "desc" },
    { publishedAt: "desc" },
    { createdAt: "desc" },
  ];
}

async function getProducts(where: Prisma.ProductWhereInput, sort: string) {
  return prisma.product.findMany({
    where,
    orderBy: getProductOrderBy(sort),
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      shortDescription: true,
      description: true,
      status: true,
      currency: true,
      baseUnit: true,
      isFeatured: true,
      isNewArrival: true,
      publishedAt: true,
      createdAt: true,
      brand: { select: { name: true } },
      primaryCategory: { select: { name: true, slug: true } },
      productCategories: {
        orderBy: { sortOrder: "asc" },
        select: { category: { select: { name: true, slug: true } } },
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        take: 1,
        select: { url: true, altText: true },
      },
    },
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const filters: ProductsFilterState = {
    q: getSingleSearchParam(resolvedSearchParams.q).trim(),
    category: getSingleSearchParam(resolvedSearchParams.category).trim(),
    sort: getSingleSearchParam(resolvedSearchParams.sort).trim() || "featured",
  };

  const selectedSort: SortValue = SORT_VALUES.includes(filters.sort as SortValue)
    ? (filters.sort as SortValue)
    : "featured";

  // Public storefront: only published (ACTIVE) products are shown, so every
  // card links to a detail page the PDP will actually serve.
  const whereClauses: Prisma.ProductWhereInput[] = [
    { status: ProductStatus.ACTIVE },
  ];

  if (filters.category) {
    whereClauses.push({
      OR: [
        { primaryCategory: { slug: filters.category } },
        { productCategories: { some: { category: { slug: filters.category } } } },
      ],
    });
  }

  if (filters.q) {
    whereClauses.push({
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { slug: { contains: filters.q, mode: "insensitive" } },
        { sku: { contains: filters.q, mode: "insensitive" } },
        { shortDescription: { contains: filters.q, mode: "insensitive" } },
        { brand: { name: { contains: filters.q, mode: "insensitive" } } },
        {
          primaryCategory: { name: { contains: filters.q, mode: "insensitive" } },
        },
      ],
    });
  }

  const where: Prisma.ProductWhereInput =
    whereClauses.length > 0 ? { AND: whereClauses } : {};

  const [products, categories] = await Promise.all([
    getProducts(where, selectedSort),
    prisma.category.findMany({
      where: {
        OR: [
          { primaryProducts: { some: {} } },
          { productCategories: { some: {} } },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const featuredCount = products.filter((product) => product.isFeatured).length;
  const imageCount = products.filter((product) => product.images.length > 0).length;
  const selectedCategory = categories.find(
    (category) => category.slug === filters.category,
  );

  const sortOptions: Array<{ value: SortValue; label: string }> = [
    { value: "featured", label: t.productsPage.sortFeatured },
    { value: "newest", label: t.productsPage.sortNewest },
    { value: "name-asc", label: t.productsPage.sortNameAsc },
    { value: "name-desc", label: t.productsPage.sortNameDesc },
  ];

  const unitLabel = (unit: string) =>
    t.unit[unit] ?? unit.charAt(0) + unit.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <main className="min-h-screen bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto flex w-full max-w-340 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-black/10 bg-[#ffffff] px-6 py-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b9ba3]">
                {t.productsPage.eyebrow}
              </p>
              <h1 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[0.98] tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
                {t.productsPage.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-[#6e6e73] sm:text-lg">
                {t.productsPage.subtitle}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: t.productsPage.statsResults, value: products.length },
                { label: t.productsPage.statsWithPhotos, value: imageCount },
                { label: t.productsPage.statsFeatured, value: featuredCount },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-lg border border-black/[0.08] bg-[#f5f5f7] px-5 py-4"
                >
                  <p className="text-sm font-medium text-[#6e6e73]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#1d1d1f]">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-[#ffffff] px-6 py-8 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="flex min-w-max gap-3">
                  <Link
                    href={buildProductsHref(filters, { category: "" })}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      filters.category
                        ? "border border-black/10 bg-white text-[#1d1d1f] hover:border-[#7c3aed] hover:text-[#7c3aed]"
                        : "bg-[#7c3aed] text-white"
                    }`}
                  >
                    {t.productsPage.allProducts}
                  </Link>

                  {categories.map((category) => {
                    const active = filters.category === category.slug;
                    return (
                      <Link
                        key={category.id}
                        href={buildProductsHref(filters, {
                          category: category.slug,
                        })}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-[#7c3aed] text-white"
                            : "border border-black/10 bg-white text-[#1d1d1f] hover:border-[#7c3aed] hover:text-[#7c3aed]"
                        }`}
                      >
                        {category.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <form className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_180px_auto]">
              <input type="hidden" name="category" value={filters.category} />

              <label className="block">
                <span className="text-sm font-semibold text-[#1d1d1f]">
                  {t.productsPage.searchLabel}
                </span>
                <input
                  type="search"
                  name="q"
                  defaultValue={filters.q}
                  placeholder={t.productsPage.searchPlaceholder}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition-colors focus:border-[#7c3aed]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#1d1d1f]">
                  {t.productsPage.sortLabel}
                </span>
                <select
                  name="sort"
                  defaultValue={selectedSort}
                  className="mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition-colors focus:border-[#7c3aed]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
                >
                  {t.productsPage.apply}
                </button>
                <Link
                  href="/products"
                  className="rounded-lg border border-black/10 px-6 py-3.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
                >
                  {t.productsPage.reset}
                </Link>
              </div>
            </form>
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b9ba3]">
              {t.productsPage.currentView}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#6e6e73]">
              {selectedCategory
                ? formatString(t.productsPage.showingInCategory, {
                    name: selectedCategory.name,
                  })
                : t.productsPage.showingFullCatalog}
            </p>
          </div>
          <p className="text-sm text-[#6e6e73]">
            {filters.q
              ? `${t.productsPage.searchPrefix} "${filters.q}"`
              : t.productsPage.narrowHint}
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => {
              const categoriesForCard = getProductCategories(product).slice(0, 3);
              const image = getProductImage(product);
              const imageAlt = image?.altText?.trim() || product.name;

              return (
                <article
                  key={product.id}
                  className="rounded-lg border border-black/10 bg-[#ffffff] p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-lg border border-black/6 bg-[#f5f5f7]">
                    <Link
                      href={`/products/${product.slug}`}
                      aria-label={product.name}
                      className="relative block aspect-[4/5]"
                    >
                      {image ? (
                        <div
                          role="img"
                          aria-label={imageAlt}
                          className="absolute inset-5 rounded-lg bg-no-repeat"
                          style={{
                            backgroundImage: `url("${image.url}")`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white text-2xl font-semibold uppercase tracking-[0.1em] text-[#7c3aed]">
                            {getInitials(product.name)}
                          </div>
                        </div>
                      )}
                    </Link>

                    {product.isNewArrival ? (
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-[#f3f0fe] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6d28d9]">
                          {t.productsPage.badgeNew}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b9ba3]">
                      {product.brand?.name ?? t.productsPage.catalogTagline}
                    </p>
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                        <Link
                          href={`/products/${product.slug}`}
                          className="transition-colors hover:text-[#7c3aed]"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <span className="rounded-lg bg-[#f3f0fe] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6d28d9]">
                        {unitLabel(product.baseUnit)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[#6e6e73]">
                      {summarizeText(product, t.productsPage.cardFallback)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {categoriesForCard.length > 0 ? (
                        categoriesForCard.map((category) => (
                          <Link
                            key={`${product.id}-${category.slug}`}
                            href={buildProductsHref(filters, {
                              category: category.slug,
                            })}
                            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#44444c] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
                          >
                            {category.name}
                          </Link>
                        ))
                      ) : (
                        <span className="rounded-lg border border-dashed border-black/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9b9ba3]">
                          {t.products.noCategory}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4 text-xs font-medium text-[#6e6e73]">
                      <span>{product.sku ?? t.productsPage.skuPending}</span>
                      <span>
                        {formatDate(
                          product.publishedAt ?? product.createdAt,
                          locale,
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <section className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="rounded-xl border border-dashed border-black/10 bg-[#ffffff] p-10 text-center shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9b9ba3]">
                  {t.productsPage.noResults}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1d1f]">
                  {t.productsPage.noProductsMatch}
                </h2>
                <p className="mt-4 text-base leading-7 text-[#6e6e73]">
                  {selectedCategory
                    ? formatString(t.productsPage.noMatchInCategory, {
                        name: selectedCategory.name,
                      })
                    : t.productsPage.noMatchHint}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/products"
                    className="rounded-lg bg-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
                  >
                    {t.productsPage.resetFilters}
                  </Link>
                  <Link
                    href="/admin/products/new"
                    className="rounded-lg border border-black/10 px-6 py-3.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
                  >
                    {t.products.addProduct}
                  </Link>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
