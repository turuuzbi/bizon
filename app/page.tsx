import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { PublicHeader } from "@/components/public-header";
import { prisma } from "@/lib/prisma";

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  baseUnit: string;
  publishedAt: Date | null;
  createdAt: Date;
  brand: { name: string } | null;
  primaryCategory: { name: string; slug: string } | null;
  productCategories: { category: { name: string; slug: string } }[];
  images: { url: string; altText: string | null }[];
};

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

const fallbackDepartments: HomeCategory[] = [
  {
    id: "timber-and-board",
    name: "Timber and Board",
    slug: "timber-and-board",
    description: "Plywood, MDF, trims, and core sheet materials.",
  },
  {
    id: "paint-and-finish",
    name: "Paint and Finish",
    slug: "paint-and-finish",
    description: "Interior paint, protective coats, and color-matched finish work.",
  },
  {
    id: "tile-and-stone",
    name: "Tile and Stone",
    slug: "tile-and-stone",
    description: "Surface materials for kitchens, baths, and durable public areas.",
  },
  {
    id: "tools-and-site",
    name: "Tools and Site",
    slug: "tools-and-site",
    description: "Daily-use hand tools and install essentials.",
  },
];

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

function formatUnitLabel(baseUnit: string) {
  return toTitleCase(baseUnit);
}

function summarizeText(product: HomeProduct) {
  const source =
    product.shortDescription?.trim() || product.description?.trim() || "";

  if (!source) {
    return "Photo-ready product slots with room for specs and richer merchandising.";
  }

  return source.length > 116 ? `${source.slice(0, 113).trim()}...` : source;
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

function getProductImage(product: HomeProduct) {
  return product.images[0] ?? null;
}

function getProductCategories(product: HomeProduct) {
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

async function getHomeData() {
  try {
    const [productCount, categoryCount, brandCount, categories, products] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.brand.count(),
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
          take: 6,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        }),
        prisma.product.findMany({
          orderBy: [
            { isFeatured: "desc" },
            { isNewArrival: "desc" },
            { publishedAt: "desc" },
            { createdAt: "desc" },
          ],
          take: 4,
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            shortDescription: true,
            description: true,
            baseUnit: true,
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
        }),
      ]);

    return {
      productCount,
      categoryCount,
      brandCount,
      categories: categories.length > 0 ? categories : fallbackDepartments,
      products,
    };
  } catch {
    return {
      productCount: 0,
      categoryCount: 0,
      brandCount: 0,
      categories: fallbackDepartments,
      products: [] as HomeProduct[],
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <PublicHeader current="home" />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_400px]">
          <div className="rounded-[40px] border border-black/10 bg-[#fffaf5] px-6 py-8 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-10 lg:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7f7391]">
              Erka&apos;s Building Materials
            </p>
            <h1 className="mt-6 max-w-4xl font-[family:var(--font-display)] text-[clamp(3rem,6vw,5.7rem)] leading-[0.92] tracking-[-0.06em] text-[#211a1f]">
              A calmer storefront for materials, finishes, and everyday site
              supply.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#62586a] sm:text-lg">
              We stripped the public side back to what actually helps people
              browse: clear departments, real product cards, and an easy path
              into the catalog. No noisy filler, no fake urgency.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#8e55cf] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
              >
                Browse products
              </Link>
              <a
                href="#departments"
                className="rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                Browse departments
              </a>
              <a
                href="#trade"
                className="rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                Trade support
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Products", value: data.productCount },
                { label: "Categories", value: data.categoryCount },
                { label: "Brands", value: data.brandCount },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-[24px] border border-black/[0.08] bg-[#f6f0e8] p-5"
                >
                  <p className="text-sm font-medium text-[#655c69]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#211a1f]">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[40px] border border-black/10 bg-[#fffdf9] p-6 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-8">
            <div className="rounded-[30px] border border-[#ede2fb] bg-[linear-gradient(180deg,#fcf8ff_0%,#f5eefc_100%)] p-6">
              <BrandLogo size="lg" className="h-auto w-[116px] sm:w-[128px]" />
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
                What changed
              </p>
              <h2 className="mt-3 font-[family:var(--font-display)] text-3xl leading-[1] tracking-[-0.05em] text-[#211a1f]">
                Cleaner framing, better pacing, and room for the products to do
                the talking.
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "A centered brand header that feels more retail than template.",
                "Departments and product cards appear first, not oversized marketing blocks.",
                "Purple is now a brand accent instead of a random UI color.",
              ].map((point) => (
                <div
                  key={point}
                  className="rounded-[22px] border border-black/8 bg-[#faf4ff] px-4 py-4 text-sm leading-7 text-[#534a59]"
                >
                  {point}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section
          id="departments"
          className="rounded-[40px] border border-black/10 bg-[#fffdf9] px-6 py-8 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
                Departments
              </p>
              <h2 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[0.98] tracking-[-0.05em] text-[#211a1f]">
                Browse by department first, then go deeper inside the catalog.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#62586a] sm:text-lg">
                The homepage stays brief, and the department grid carries people
                straight into the part of the catalog they actually need.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
            >
              Open full catalog
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {data.categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-[28px] border border-black/[0.08] bg-[#fffaf5] p-5 transition-transform duration-200 hover:-translate-y-1"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c7f9a]">
                  {category.slug.replace(/-/g, " ")}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#211a1f]">
                  {category.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#62586a]">
                  {category.description?.trim() ||
                    "Open this department in the catalog and browse the current product list."}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[40px] border border-black/10 bg-[#fffaf5] px-6 py-8 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
                Latest in catalog
              </p>
              <h2 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[0.98] tracking-[-0.05em] text-[#211a1f]">
                Product cards now have room for photos, names, and useful detail.
              </h2>
              <p className="mt-4 text-base leading-8 text-[#62586a] sm:text-lg">
                This preview uses the same real product data as the catalog page,
                so the storefront reflects what is actually in your database.
              </p>
            </div>
          </div>

          {data.products.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {data.products.map((product) => {
                const image = getProductImage(product);
                const productCategories = getProductCategories(product).slice(0, 2);

                return (
                  <article
                    key={product.id}
                    className="rounded-[30px] border border-black/[0.08] bg-white p-4 shadow-[0_18px_48px_rgba(28,23,19,0.05)]"
                  >
                    <div className="relative overflow-hidden rounded-[24px] border border-black/6 bg-[#f5efe8]">
                      <div className="relative aspect-[4/5]">
                        {image ? (
                          <div
                            role="img"
                            aria-label={image.altText?.trim() || product.name}
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
                        {productCategories.length > 0 ? (
                          productCategories.map((category) => (
                            <Link
                              key={`${product.id}-${category.slug}`}
                              href={`/products?category=${category.slug}`}
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
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[30px] border border-dashed border-black/10 bg-white px-6 py-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
                Catalog preview
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#211a1f]">
                Add your next products in admin and they will surface here.
              </h3>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/admin/products/new"
                  className="rounded-full bg-[#8e55cf] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
                >
                  Add product
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                >
                  Open catalog
                </Link>
              </div>
            </div>
          )}
        </section>

        <section
          id="trade"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_360px]"
        >
          <div className="rounded-[40px] border border-black/10 bg-[#fffdf9] px-6 py-8 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
              Trade support
            </p>
            <h2 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[0.98] tracking-[-0.05em] text-[#211a1f]">
              Built to grow into repeat ordering and project-driven supply.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Share the list",
                  copy: "Send the item mix, preferred brands, and rough quantities first.",
                },
                {
                  title: "Check availability",
                  copy: "Use the catalog to confirm departments and narrow the shortlist quickly.",
                },
                {
                  title: "Plan delivery",
                  copy: "Keep target dates, district, and repeat ordering notes in one place.",
                },
              ].map((step) => (
                <article
                  key={step.title}
                  className="rounded-[28px] border border-black/[0.08] bg-[#fffaf5] p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c7f9a]">
                    {step.title}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#62586a]">
                    {step.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside
            id="contact"
            className="rounded-[40px] border border-black/10 bg-[#f7f0ff] p-6 shadow-[0_24px_60px_rgba(28,23,19,0.06)] sm:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
              Project notes
            </p>
            <h3 className="mt-4 font-[family:var(--font-display)] text-3xl leading-[0.98] tracking-[-0.05em] text-[#211a1f]">
              What helps a quote move faster
            </h3>
            <div className="mt-6 space-y-3">
              {[
                "Which materials are fixed and which ones are still flexible.",
                "The quantity or area you are estimating against.",
                "Whether the request is for one-time supply or repeat ordering.",
              ].map((point) => (
                <div
                  key={point}
                  className="rounded-[22px] border border-[#e2d3f3] bg-white px-4 py-4 text-sm leading-7 text-[#574f5f]"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#8e55cf] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
              >
                View catalog
              </Link>
              <Link
                href="/sign-in"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#2d2731] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                Sign in
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
