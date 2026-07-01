import Link from "next/link";
import { Prisma, ProductStatus } from "@prisma/client";

import { ActiveFilterChips, type ActiveFilterChip } from "@/components/marketplace/active-filter-chips";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs";
import { FiltersSidebar } from "@/components/marketplace/filters-sidebar";
import { ProductCard } from "@/components/marketplace/product-card";
import { SortSelect } from "@/components/marketplace/sort-select";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { formatString, getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";
import type { ProductSummary } from "@/components/marketplace/types";

type SearchParamValue = string | string[] | undefined;

type ProductsPageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

type FilterState = {
  q: string;
<<<<<<< HEAD
  category: string;
=======
  categories: string[];
  brands: string[];
  stock: "in" | "out" | "";
  featured: boolean;
  newArrivals: boolean;
>>>>>>> c7d5ade (bizon)
  sort: string;
};

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

function getMultiSearchParam(value: SearchParamValue): string[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(raw.map((entry) => entry.trim()).filter(Boolean))];
}

<<<<<<< HEAD
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
=======
function buildHref(state: FilterState) {
>>>>>>> c7d5ade (bizon)
  const params = new URLSearchParams();
  state.categories.forEach((slug) => params.append("category", slug));
  state.brands.forEach((slug) => params.append("brand", slug));
  if (state.q) params.set("q", state.q);
  if (state.stock) params.set("stock", state.stock);
  if (state.featured) params.set("featured", "1");
  if (state.newArrivals) params.set("new", "1");
  if (state.sort && state.sort !== "featured") params.set("sort", state.sort);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
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

function isVariantSetInStock(
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

async function getProducts(where: Prisma.ProductWhereInput, sort: string) {
  return prisma.product.findMany({
    where,
    orderBy: getProductOrderBy(sort),
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
        orderBy: { sortOrder: "asc" },
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

function getPrimaryCategorySlug(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  if (product.primaryCategory) return product.primaryCategory;
  return product.productCategories[0]?.category ?? null;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
<<<<<<< HEAD
  const resolvedSearchParams = await searchParams;
  const filters: ProductsFilterState = {
    q: getSingleSearchParam(resolvedSearchParams.q).trim(),
    category: getSingleSearchParam(resolvedSearchParams.category).trim(),
    sort: getSingleSearchParam(resolvedSearchParams.sort).trim() || "featured",
=======
  const tm = t.marketplace;
  const resolved = await searchParams;

  const rawStock = getSingleSearchParam(resolved.stock);
  const filters: FilterState = {
    q: getSingleSearchParam(resolved.q).trim(),
    categories: getMultiSearchParam(resolved.category),
    brands: getMultiSearchParam(resolved.brand),
    stock: rawStock === "in" || rawStock === "out" ? rawStock : "",
    featured: getSingleSearchParam(resolved.featured) === "1",
    newArrivals: getSingleSearchParam(resolved.new) === "1",
    sort: getSingleSearchParam(resolved.sort).trim() || "featured",
>>>>>>> c7d5ade (bizon)
  };

  const selectedSort: SortValue = SORT_VALUES.includes(filters.sort as SortValue)
    ? (filters.sort as SortValue)
    : "featured";

<<<<<<< HEAD
  // Public storefront: only published (ACTIVE) products are shown, so every
  // card links to a detail page the PDP will actually serve.
  const whereClauses: Prisma.ProductWhereInput[] = [
    { status: ProductStatus.ACTIVE },
  ];
=======
  const whereClauses: Prisma.ProductWhereInput[] = [{ status: ProductStatus.ACTIVE }];
>>>>>>> c7d5ade (bizon)

  if (filters.categories.length > 0) {
    whereClauses.push({
      OR: [
        { primaryCategory: { slug: { in: filters.categories } } },
        {
          productCategories: {
            some: { category: { slug: { in: filters.categories } } },
          },
        },
      ],
    });
  }

  if (filters.brands.length > 0) {
    whereClauses.push({ brand: { slug: { in: filters.brands } } });
  }

  if (filters.featured) whereClauses.push({ isFeatured: true });
  if (filters.newArrivals) whereClauses.push({ isNewArrival: true });

  if (filters.q) {
    whereClauses.push({
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { slug: { contains: filters.q, mode: "insensitive" } },
        { sku: { contains: filters.q, mode: "insensitive" } },
        { shortDescription: { contains: filters.q, mode: "insensitive" } },
        { brand: { name: { contains: filters.q, mode: "insensitive" } } },
        { primaryCategory: { name: { contains: filters.q, mode: "insensitive" } } },
      ],
    });
  }

  const where: Prisma.ProductWhereInput = { AND: whereClauses };

  const [productsBeforeStockFilter, categoryFacets, brandFacets] = await Promise.all([
    getProducts(where, selectedSort),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parent: { select: { name: true, slug: true } },
        _count: { select: { primaryProducts: { where: { status: ProductStatus.ACTIVE } } } },
      },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: { where: { status: ProductStatus.ACTIVE } } } },
      },
    }),
  ]);

  const productsWithStock = productsBeforeStockFilter.map((product) => ({
    product,
    inStock: isVariantSetInStock(product.variants),
  }));

<<<<<<< HEAD
=======
  const inStockCount = productsWithStock.filter((entry) => entry.inStock).length;
  const outOfStockCount = productsWithStock.length - inStockCount;

  const visibleProducts = productsWithStock.filter((entry) => {
    if (filters.stock === "in") return entry.inStock;
    if (filters.stock === "out") return !entry.inStock;
    return true;
  });

  const unitLabel = (unit: string) =>
    t.unit[unit] ?? unit.charAt(0) + unit.slice(1).toLowerCase().replace(/_/g, " ");

  const productSummaries: ProductSummary[] = visibleProducts.map(({ product, inStock }) => {
    const category = getPrimaryCategorySlug(product);
    const image = product.images[0] ?? null;
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand?.name ?? null,
      categoryName: category?.name ?? null,
      categorySlug: category?.slug ?? null,
      unitLabel: unitLabel(product.baseUnit),
      imageUrl: image?.url ?? null,
      imageAlt: image?.altText ?? null,
      inStock,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      sku: product.sku,
    };
  });

  const categoryFacetsWithCount = categoryFacets.filter(
    (category) => category._count.primaryProducts > 0 || filters.categories.includes(category.slug),
  );
  const brandFacetsWithCount = brandFacets.filter(
    (brand) => brand._count.products > 0 || filters.brands.includes(brand.slug),
  );

>>>>>>> c7d5ade (bizon)
  const sortOptions: Array<{ value: SortValue; label: string }> = [
    { value: "featured", label: t.productsPage.sortFeatured },
    { value: "newest", label: t.productsPage.sortNewest },
    { value: "name-asc", label: t.productsPage.sortNameAsc },
    { value: "name-desc", label: t.productsPage.sortNameDesc },
  ];

  // Title + breadcrumb: when exactly one category is selected, show its full
  // parent chain — e.g. Home > Building Materials > Paint.
  const selectedCategoryObjects = categoryFacets.filter((category) =>
    filters.categories.includes(category.slug),
  );
  const singleSelectedCategory =
    selectedCategoryObjects.length === 1 ? selectedCategoryObjects[0] : null;

  const breadcrumbItems: BreadcrumbItem[] = [{ label: t.breadcrumbs.home, href: "/" }];
  if (singleSelectedCategory?.parent) {
    breadcrumbItems.push({
      label: singleSelectedCategory.parent.name,
      href: `/products?category=${singleSelectedCategory.parent.slug}`,
    });
  } else {
    breadcrumbItems.push({ label: t.breadcrumbs.catalog, href: "/products" });
  }
  if (singleSelectedCategory) {
    breadcrumbItems.push({ label: singleSelectedCategory.name });
  } else if (filters.q) {
    breadcrumbItems.push({ label: `"${filters.q}"` });
  }

  const titleLabel = singleSelectedCategory
    ? singleSelectedCategory.name
    : filters.q
      ? `${t.productsPage.searchPrefix} "${filters.q}"`
      : t.productsPage.allProducts;

  const chips: ActiveFilterChip[] = [
    ...selectedCategoryObjects.map((category) => ({
      key: `category-${category.slug}`,
      label: category.name,
      href: buildHref({
        ...filters,
        categories: filters.categories.filter((slug) => slug !== category.slug),
      }),
    })),
    ...brandFacets
      .filter((brand) => filters.brands.includes(brand.slug))
      .map((brand) => ({
        key: `brand-${brand.slug}`,
        label: brand.name,
        href: buildHref({
          ...filters,
          brands: filters.brands.filter((slug) => slug !== brand.slug),
        }),
      })),
    ...(filters.stock
      ? [
          {
            key: "stock",
            label: filters.stock === "in" ? tm.filters.inStock : tm.filters.outOfStock,
            href: buildHref({ ...filters, stock: "" as const }),
          },
        ]
      : []),
    ...(filters.featured
      ? [
          {
            key: "featured",
            label: tm.filters.featured,
            href: buildHref({ ...filters, featured: false }),
          },
        ]
      : []),
    ...(filters.newArrivals
      ? [
          {
            key: "new",
            label: tm.filters.newArrivals,
            href: buildHref({ ...filters, newArrivals: false }),
          },
        ]
      : []),
    ...(filters.q
      ? [
          {
            key: "q",
            label: `"${filters.q}"`,
            href: buildHref({ ...filters, q: "" }),
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-screen bg-white">
      <PublicHeader current="products" />
<<<<<<< HEAD
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
=======
      <div className="mx-auto w-full max-w-340 px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#18181b] sm:text-[32px]">
              {titleLabel}
            </h1>
            <p className="mt-1 text-sm text-[#71717a]">
              {formatString(tm.itemsCount, { count: visibleProducts.length })}
            </p>
          </div>
          <SortSelect
            value={selectedSort}
            options={sortOptions}
            label={t.productsPage.sortLabel}
          />
        </div>

        <div className="mt-3">
          <ActiveFilterChips
            chips={chips}
            clearAllHref="/products"
            title={tm.filters.activeFilters}
            clearAllLabel={tm.filters.clearAll}
          />
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[230px_1fr]">
          <div className="lg:sticky lg:top-[104px] lg:h-fit">
            <FiltersSidebar
              categories={categoryFacetsWithCount.map((category) => ({
                slug: category.slug,
                name: category.name,
                count: category._count.primaryProducts,
              }))}
              brands={brandFacetsWithCount.map((brand) => ({
                slug: brand.slug,
                name: brand.name,
                count: brand._count.products,
              }))}
              selectedCategories={filters.categories}
              selectedBrands={filters.brands}
              stock={filters.stock}
              featured={filters.featured}
              newArrivals={filters.newArrivals}
              searchValue={filters.q}
              inStockCount={inStockCount}
              outOfStockCount={outOfStockCount}
            />
          </div>

          {productSummaries.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {productSummaries.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] border border-dashed border-[#d4d4d8] bg-[#f6f6f7] px-6 py-14 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#71717a]">
                {t.productsPage.noResults}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#18181b]">
                {t.productsPage.noProductsMatch}
              </h2>
              <p className="mt-3 text-sm text-[#71717a]">{t.productsPage.noMatchHint}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/products"
                  className="rounded-[8px] bg-[#8e55cf] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
>>>>>>> c7d5ade (bizon)
                >
                  {t.productsPage.resetFilters}
                </Link>
              </div>
<<<<<<< HEAD
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
=======
            </div>
>>>>>>> c7d5ade (bizon)
          )}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
