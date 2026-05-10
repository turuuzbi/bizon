import Link from "next/link";
import { Prisma, ProductStatus } from "@prisma/client";

import { PublicHeader } from "@/components/public-header";
import { prisma } from "@/lib/prisma";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: ProductStatus.ACTIVE, label: "Active" },
  { value: ProductStatus.DRAFT, label: "Draft" },
  { value: ProductStatus.ARCHIVED, label: "Archived" },
] as const;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "newest", label: "Newest first" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
] as const;

type SearchParamValue = string | string[] | undefined;

type ProductsPageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

type ProductsFilterState = {
  q: string;
  status: string;
  category: string;
  sort: string;
};

type ProductCard = Awaited<ReturnType<typeof getProducts>>[number];

export const metadata = {
  title: "Products | Erka's",
  description:
    "Browse the Erka's catalog in a clean, photo-ready product viewer.",
};

function getSingleSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatStatusLabel(status: ProductStatus) {
  return toTitleCase(status);
}

function formatUnitLabel(baseUnit: string) {
  return toTitleCase(baseUnit);
}

function summarizeText(product: ProductCard) {
  const source =
    product.shortDescription?.trim() || product.description?.trim() || "";

  if (!source) {
    return "Ready for product photography, specs, and fuller merchandising.";
  }

  return source.length > 120 ? `${source.slice(0, 117).trim()}...` : source;
}

function getStatusClass(status: ProductStatus) {
  if (status === ProductStatus.ACTIVE) {
    return "bg-[#e9f3e8] text-[#36533c]";
  }

  if (status === ProductStatus.ARCHIVED) {
    return "bg-[#ece6df] text-[#5f5952]";
  }

  return "bg-[#f6ece0] text-[#7c5c3d]";
}

function buildProductsHref(
  filters: ProductsFilterState,
  overrides: Partial<ProductsFilterState>,
) {
  const params = new URLSearchParams();
  const merged = { ...filters, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    const trimmed = value.trim();

    if (trimmed) {
      params.set(key, trimmed);
    }
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
  if (sort === "newest") {
    return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "name-asc") {
    return [{ name: "asc" }];
  }

  if (sort === "name-desc") {
    return [{ name: "desc" }];
  }

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
      brand: {
        select: {
          name: true,
        },
      },
      primaryCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
      productCategories: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        take: 1,
        select: {
          url: true,
          altText: true,
        },
      },
    },
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters: ProductsFilterState = {
    q: getSingleSearchParam(resolvedSearchParams.q).trim(),
    status: getSingleSearchParam(resolvedSearchParams.status).trim(),
    category: getSingleSearchParam(resolvedSearchParams.category).trim(),
    sort: getSingleSearchParam(resolvedSearchParams.sort).trim() || "featured",
  };

  const selectedStatus = Object.values(ProductStatus).includes(
    filters.status as ProductStatus,
  )
    ? (filters.status as ProductStatus)
    : null;
  const selectedSort = SORT_OPTIONS.some((option) => option.value === filters.sort)
    ? filters.sort
    : "featured";
  const whereClauses: Prisma.ProductWhereInput[] = [];

  if (selectedStatus) {
    whereClauses.push({ status: selectedStatus });
  }

  if (filters.category) {
    whereClauses.push({
      OR: [
        {
          primaryCategory: {
            slug: filters.category,
          },
        },
        {
          productCategories: {
            some: {
              category: {
                slug: filters.category,
              },
            },
          },
        },
      ],
    });
  }

  if (filters.q) {
    whereClauses.push({
      OR: [
        {
          name: {
            contains: filters.q,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: filters.q,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: filters.q,
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: filters.q,
            mode: "insensitive",
          },
        },
        {
          brand: {
            name: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
        },
        {
          primaryCategory: {
            name: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
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
          {
            primaryProducts: {
              some: {},
            },
          },
          {
            productCategories: {
              some: {},
            },
          },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  const featuredCount = products.filter((product) => product.isFeatured).length;
  const imageCount = products.filter((product) => product.images.length > 0).length;
  const selectedCategory = categories.find(
    (category) => category.slug === filters.category,
  );

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <PublicHeader current="products" />

        <section className="rounded-[40px] border border-black/10 bg-[#fffaf5] px-6 py-8 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
                Product catalog
              </p>
              <h1 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[0.98] tracking-[-0.05em] text-[#211a1f] sm:text-5xl">
                Browse by department, then narrow the list with search and sort.
              </h1>
              <p className="mt-4 text-base leading-8 text-[#62586a] sm:text-lg">
                The layout stays simple on purpose: categories first, filters
                second, and image-ready cards that give the product room to be
                seen clearly.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Results", value: products.length },
                { label: "With photos", value: imageCount },
                { label: "Featured", value: featuredCount },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-[22px] border border-black/[0.08] bg-[#f6f0e8] px-5 py-4"
                >
                  <p className="text-sm font-medium text-[#655c69]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#211a1f]">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[40px] border border-black/10 bg-[#fffdf9] px-6 py-8 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-8">
          <div className="flex flex-col gap-6">
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="flex min-w-max gap-3">
                  <Link
                    href={buildProductsHref(filters, { category: "" })}
                    className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      filters.category
                        ? "border border-black/10 bg-white text-[#2d2731] hover:border-[#8e55cf] hover:text-[#8e55cf]"
                        : "bg-[#8e55cf] text-white"
                    }`}
                  >
                    All products
                  </Link>

                  {categories.map((category) => {
                    const active = filters.category === category.slug;

                    return (
                      <Link
                        key={category.id}
                        href={buildProductsHref(filters, {
                          category: category.slug,
                        })}
                        className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-[#8e55cf] text-white"
                            : "border border-black/10 bg-white text-[#2d2731] hover:border-[#8e55cf] hover:text-[#8e55cf]"
                        }`}
                      >
                        {category.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <form className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_180px_180px_auto]">
              <input type="hidden" name="category" value={filters.category} />

              <label className="block">
                <span className="text-sm font-semibold text-[#211a1f]">
                  Search
                </span>
                <input
                  type="search"
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Product, SKU, brand..."
                  className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#211a1f] outline-none transition-colors focus:border-[#8e55cf]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#211a1f]">
                  Status
                </span>
                <select
                  name="status"
                  defaultValue={filters.status}
                  className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#211a1f] outline-none transition-colors focus:border-[#8e55cf]"
                >
                  {STATUS_FILTERS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#211a1f]">
                  Sort
                </span>
                <select
                  name="sort"
                  defaultValue={selectedSort}
                  className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#211a1f] outline-none transition-colors focus:border-[#8e55cf]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#8e55cf] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
                >
                  Apply
                </button>
                <Link
                  href="/products"
                  className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                >
                  Reset
                </Link>
              </div>
            </form>
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
              Current view
            </p>
            <p className="mt-2 text-sm leading-7 text-[#62586a]">
              {selectedCategory
                ? `Showing products in ${selectedCategory.name}.`
                : "Showing the full catalog."}
            </p>
          </div>
          <p className="text-sm text-[#62586a]">
            {filters.q
              ? `Search: "${filters.q}"`
              : "Use search or category chips to narrow the list."}
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
                  className="rounded-[30px] border border-black/10 bg-[#fffaf6] p-4 shadow-[0_18px_48px_rgba(28,23,19,0.05)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-[24px] border border-black/6 bg-[#f5efe8]">
                    <div className="relative aspect-[4/5]">
                      {image ? (
                        <div
                          role="img"
                          aria-label={imageAlt}
                          className="absolute inset-5 rounded-[18px] bg-no-repeat"
                          style={{
                            backgroundImage: `url("${image.url}")`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-2xl font-semibold uppercase tracking-[0.16em] text-[#8e55cf]">
                            {getInitials(product.name)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusClass(
                          product.status,
                        )}`}
                      >
                        {formatStatusLabel(product.status)}
                      </span>

                      {product.isNewArrival ? (
                        <span className="rounded-full bg-[#efe4fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6d36ad]">
                          New
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c7f9a]">
                      {product.brand?.name ?? "Erka's catalog"}
                    </p>
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#211a1f]">
                        {product.name}
                      </h3>
                      <span className="rounded-full bg-[#f3ebfb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d36ad]">
                        {formatUnitLabel(product.baseUnit)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[#5f5664]">
                      {summarizeText(product)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {categoriesForCard.length > 0 ? (
                        categoriesForCard.map((category) => (
                          <Link
                            key={`${product.id}-${category.slug}`}
                            href={buildProductsHref(filters, {
                              category: category.slug,
                            })}
                            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#403946] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                          >
                            {category.name}
                          </Link>
                        ))
                      ) : (
                        <span className="rounded-full border border-dashed border-black/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b727f]">
                          No category
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4 text-xs font-medium text-[#6b636a]">
                      <span>{product.sku ?? "SKU pending"}</span>
                      <span>{formatDate(product.publishedAt ?? product.createdAt)}</span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <section className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="rounded-[36px] border border-dashed border-black/10 bg-[#fffaf5] p-10 text-center shadow-[0_24px_60px_rgba(28,23,19,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
                  No results
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#211a1f]">
                  No products match this view.
                </h2>
                <p className="mt-4 text-base leading-7 text-[#62586a]">
                  {selectedCategory
                    ? `Nothing matched the current filters inside ${selectedCategory.name}.`
                    : "Try another category, search term, or status filter."}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/products"
                    className="rounded-full bg-[#8e55cf] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
                  >
                    Reset filters
                  </Link>
                  <Link
                    href="/admin/products/new"
                    className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                  >
                    Add product
                  </Link>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
