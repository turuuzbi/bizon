import Link from "next/link";

import { HeroCarousel } from "@/components/hero-carousel";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
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

function fallbackDepartments(t: {
  nav: {
    timber: string;
    paint: string;
    tile: string;
    tools: string;
    building: string;
    home: string;
  };
}): HomeCategory[] {
  return [
    {
      id: "timber-and-board",
      name: t.nav.timber,
      slug: "timber-and-board",
      description: null,
    },
    {
      id: "paint-and-finish",
      name: t.nav.paint,
      slug: "paint-and-finish",
      description: null,
    },
    {
      id: "tile-and-stone",
      name: t.nav.tile,
      slug: "tile-and-stone",
      description: null,
    },
    {
      id: "tools-and-site",
      name: t.nav.tools,
      slug: "tools-and-site",
      description: null,
    },
    {
      id: "building-materials",
      name: t.nav.building,
      slug: "building-materials",
      description: null,
    },
    {
      id: "home-living",
      name: t.nav.home,
      slug: "home-living",
      description: null,
    },
  ];
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatUnitLabel(baseUnit: string) {
  return toTitleCase(baseUnit);
}

function summarizeText(product: HomeProduct, emptyCopy: string) {
  const source =
    product.shortDescription?.trim() || product.description?.trim() || "";
  if (!source) return emptyCopy;
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
  const map = new Map<string, { name: string; slug: string }>();
  if (product.primaryCategory) {
    map.set(product.primaryCategory.slug, {
      name: product.primaryCategory.name,
      slug: product.primaryCategory.slug,
    });
  }
  for (const entry of product.productCategories) {
    map.set(entry.category.slug, {
      name: entry.category.name,
      slug: entry.category.slug,
    });
  }
  return [...map.values()];
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
              { primaryProducts: { some: {} } },
              { productCategories: { some: {} } },
            ],
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          take: 6,
          select: { id: true, name: true, slug: true, description: true },
        }),
        prisma.product.findMany({
          orderBy: [
            { isFeatured: "desc" },
            { isNewArrival: "desc" },
            { publishedAt: "desc" },
            { createdAt: "desc" },
          ],
          take: 8,
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
        }),
      ]);

    return { productCount, categoryCount, brandCount, categories, products };
  } catch {
    return {
      productCount: 0,
      categoryCount: 0,
      brandCount: 0,
      categories: [] as HomeCategory[],
      products: [] as HomeProduct[],
    };
  }
}

const partnerBrands = [
  "Fiskars",
  "STIHL",
  "Bosch",
  "Knauf",
  "Henkel",
  "Caparol",
  "Tikkurila",
  "Makita",
  "Hilti",
  "DeWalt",
  "3M",
  "Sika",
];

const categoryIcons: Record<string, string> = {
  "timber-and-board":
    "M3 19h18M5 19V9l7-4 7 4v10M9 19v-6h6v6",
  "paint-and-finish":
    "M19 11h-7V5h1a4 4 0 0 0 0-8H8a4 4 0 0 0 0 8h1v6H2v9h17v-9z",
  "tile-and-stone":
    "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  "tools-and-site":
    "M14.7 6.3a4 4 0 0 1 5.7 5.7l-2.1-2.1-2.8 2.8 2.1 2.1a4 4 0 0 1-5.7-5.7M7 17l-4 4M10 14l-7 7M13 11l-3 3",
  "building-materials":
    "M3 21V9l9-6 9 6v12M9 21v-6h6v6",
  "home-living":
    "M3 12 12 4l9 8v9H3z M9 21v-6h6v6",
};

const categoryIconFallback =
  "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const data = await getHomeData();

  const departments =
    data.categories.length > 0 ? data.categories : fallbackDepartments(t);

  const featuredDepartments = departments.slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <PublicHeader current="home" />

      <div className="mx-auto w-full max-w-340 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero with side promo */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <HeroCarousel
            slides={t.hero.slides}
            accentLabels={[t.nav.timber, t.nav.paint, t.nav.tools]}
          />

          <aside className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[28px] bg-[#8e55cf] p-6 text-white shadow-[0_24px_60px_rgba(142,85,207,0.25)]">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/5" />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                {t.hero.sideBadge}
              </p>
              <h3 className="relative mt-4 font-[family:var(--font-display)] text-2xl leading-snug tracking-[-0.02em]">
                {t.hero.sideTitle}
              </h3>
              <Link
                href="/products"
                className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#8e55cf] transition-colors hover:bg-[#f3ebfb]"
              >
                {t.hero.sideCta}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="rounded-[28px] border border-black/8 bg-[#fbf8f4] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7e4cb8]">
                {locale === "mn" ? "Бидний тоо" : "By the numbers"}
              </p>
              <div className="mt-5 space-y-4">
                {[
                  { label: t.nav.departments, value: data.categoryCount || 24 },
                  { label: t.nav.brands, value: data.brandCount || 48 },
                  {
                    label:
                      locale === "mn" ? "Бараа" : "Products",
                    value: data.productCount || 1200,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-end justify-between gap-3 border-b border-black/8 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm text-[#5f5664]">{row.label}</span>
                    <span className="font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-[#1f1828]">
                      {row.value}+
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Promo strip */}
        <section className="mt-10 grid grid-cols-2 gap-3 rounded-[24px] border border-black/8 bg-[#fbf8f4] p-4 md:grid-cols-4">
          {[
            {
              ...t.promoStrip.fastDelivery,
              icon: "M1 3h15v13H1z M16 8h4l3 3v5h-7z",
              extra: <><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
            },
            {
              ...t.promoStrip.bulkOrders,
              icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12",
              extra: null,
            },
            {
              ...t.promoStrip.expertSupport,
              icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
              extra: null,
            },
            {
              ...t.promoStrip.securePayment,
              icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
              extra: null,
            },
          ].map((tile) => (
            <div
              key={tile.title}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(28,23,19,0.04)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3ebfb] text-[#8e55cf]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d={tile.icon} />
                  {tile.extra}
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1f1828]">
                  {tile.title}
                </p>
                <p className="text-xs text-[#655c69]">{tile.copy}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Category grid */}
        <section id="departments" className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e55cf]">
                {t.categoryGrid.eyebrow}
              </p>
              <h2 className="mt-3 font-[family:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.04em] text-[#1f1828] sm:text-5xl">
                {t.categoryGrid.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-[#655c69]">
                {t.categoryGrid.subtitle}
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1f1828] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
            >
              {t.categoryGrid.viewAll}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {featuredDepartments.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-[#8e55cf] hover:shadow-[0_18px_40px_rgba(142,85,207,0.18)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fbf8f4] text-[#8e55cf] transition-colors group-hover:bg-[#f3ebfb]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7"
                  >
                    <path
                      d={categoryIcons[category.slug] ?? categoryIconFallback}
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1f1828]">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured collection band */}
        <section className="mt-14 overflow-hidden rounded-[36px] border border-black/8 bg-[linear-gradient(120deg,#1f1828_0%,#2c2138_55%,#8e55cf_120%)] text-white">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c8b7e2]">
                {t.featured.eyebrow}
              </p>
              <h2 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                {t.featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                {t.featured.copy}
              </p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {[t.featured.benefit1, t.featured.benefit2, t.featured.benefit3].map(
                  (benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-white/85"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-[#c8b7e2]"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {benefit}
                    </li>
                  ),
                )}
              </ul>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#1f1828] transition-colors hover:bg-[#f3ebfb] hover:text-[#7e4cb8]"
              >
                {t.featured.cta}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="relative grid grid-cols-2 gap-3">
              {[
                { label: locale === "mn" ? "Хувцасны өрөө" : "Wardrobe", h: "h-44" },
                { label: locale === "mn" ? "Номын тавиур" : "Bookshelves", h: "h-32" },
                { label: locale === "mn" ? "Гараж" : "Garage", h: "h-32" },
                { label: locale === "mn" ? "Оффис" : "Office", h: "h-44" },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`flex ${card.h} flex-col justify-end rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur transition-all hover:bg-white/15`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    Elfa
                  </span>
                  <span className="mt-1 text-base font-semibold">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e55cf]">
                {t.products.eyebrow}
              </p>
              <h2 className="mt-3 font-[family:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.04em] text-[#1f1828] sm:text-5xl">
                {t.products.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-[#655c69]">
                {t.products.subtitle}
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#8e55cf] hover:text-[#7d45c1]"
            >
              {t.products.viewAll}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {data.products.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.products.map((product) => {
                const image = getProductImage(product);
                const productCategories = getProductCategories(product).slice(
                  0,
                  1,
                );

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white transition-all hover:-translate-y-1 hover:border-[#8e55cf]/40 hover:shadow-[0_20px_50px_rgba(28,23,19,0.08)]"
                  >
                    <Link
                      href={`/products?category=${productCategories[0]?.slug ?? ""}`}
                      className="relative block aspect-square overflow-hidden bg-[#fbf8f4]"
                    >
                      {image ? (
                        <div
                          role="img"
                          aria-label={image.altText?.trim() || product.name}
                          className="absolute inset-6 rounded-xl bg-no-repeat transition-transform duration-300 group-hover:scale-[1.04]"
                          style={{
                            backgroundImage: `url("${image.url}")`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-2xl font-semibold uppercase tracking-[0.16em] text-[#8e55cf]">
                            {getInitials(product.name)}
                          </div>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7e4cb8] backdrop-blur">
                        {formatUnitLabel(product.baseUnit)}
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c7f9a]">
                        {product.brand?.name ?? "Erka's"}
                      </p>
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#1f1828]">
                        {product.name}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-6 text-[#655c69]">
                        {summarizeText(
                          product,
                          locale === "mn"
                            ? "Барааны дэлгэрэнгүй мэдээллийг каталогоос үзнэ үү."
                            : "See more details in the catalog.",
                        )}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="text-xs text-[#655c69]">
                          {t.products.sku}: {product.sku ?? "—"}
                        </span>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#8e55cf] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#7d45c1]"
                          aria-label={t.products.addToCart}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          {t.products.addToCart}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-[#fbf8f4] px-6 py-12 text-center">
              <h3 className="font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1f1828]">
                {t.products.emptyTitle}
              </h3>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/admin/products/new"
                  className="rounded-full bg-[#8e55cf] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
                >
                  {t.products.addProduct}
                </Link>
                <Link
                  href="/products"
                  className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-[#1f1828] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                >
                  {t.products.openCatalog}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Brand strip */}
        <section className="mt-14 rounded-[28px] border border-black/8 bg-[#fbf8f4] p-8 sm:p-10">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e55cf]">
              {t.brands.eyebrow}
            </p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1f1828]">
              {t.brands.title}
            </h3>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {partnerBrands.map((brand) => (
              <div
                key={brand}
                className="flex h-16 items-center justify-center rounded-2xl border border-black/8 bg-white text-sm font-[family:var(--font-display)] font-semibold tracking-[-0.02em] text-[#1f1828] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                {brand}
              </div>
            ))}
          </div>
        </section>

        {/* Trade support */}
        <section id="trade" className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-[32px] border border-black/8 bg-white p-8 sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e55cf]">
              {t.trade.eyebrow}
            </p>
            <h2 className="mt-3 font-[family:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.04em] text-[#1f1828]">
              {t.trade.title}
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[t.trade.step1, t.trade.step2, t.trade.step3].map(
                (step, index) => (
                  <article
                    key={step.title}
                    className="rounded-2xl bg-[#fbf8f4] p-5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8e55cf] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="mt-4 text-sm font-semibold text-[#1f1828]">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#655c69]">
                      {step.copy}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>

          <aside
            id="contact"
            className="rounded-[32px] border border-[#e2d3f3] bg-[linear-gradient(160deg,#f7f0ff_0%,#ffffff_100%)] p-8 sm:p-10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e55cf]">
              {t.newsletter.eyebrow}
            </p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-3xl leading-[1.1] tracking-[-0.04em] text-[#1f1828]">
              {t.newsletter.title}
            </h3>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder={t.newsletter.placeholder}
                className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-[#1f1828] placeholder:text-[#7b7088] focus:border-[#8e55cf] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#8e55cf] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
              >
                {t.newsletter.button}
              </button>
            </form>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-[#e2d3f3] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e55cf]">
                  {t.footer.contactTitle}
                </p>
                <p className="mt-2 font-semibold text-[#1f1828]">
                  {t.footer.phone}
                </p>
                <p className="text-xs text-[#655c69]">{t.footer.email}</p>
              </div>
              <div className="rounded-2xl border border-[#e2d3f3] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e55cf]">
                  {t.footer.hoursTitle}
                </p>
                <p className="mt-2 font-semibold text-[#1f1828]">
                  {t.footer.hoursWeekday}
                </p>
                <p className="text-xs text-[#655c69]">
                  {t.footer.hoursSaturday}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
