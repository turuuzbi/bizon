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

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Shared section intro: eyebrow + title + optional subtitle on the left, an
 * optional action (e.g. "view all") on the right. Centralising this keeps the
 * type scale and spacing identical across every band on the page.
 */
function SectionIntro({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7c3aed]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-[family:var(--font-display)] text-3xl leading-[1.05] tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-base leading-7 text-[#6e6e73]">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

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

      {/*
        Consistent vertical rhythm: a single large gap (gap-20 / gap-28) between
        major bands creates the "spacious, intentional" feel the brief asks for,
        instead of the previous ad-hoc mt-10 / mt-14 spacing.
      */}
      <div className="mx-auto flex w-full max-w-340 flex-col gap-20 px-4 pb-20 pt-8 sm:gap-28 sm:px-6 sm:pt-10 lg:px-8">
        {/* HERO — a single full-width carousel is the sole focus, hausplus-style. */}
        <section>
          <HeroCarousel
            slides={t.hero.slides}
            accentLabels={[t.nav.timber, t.nav.paint, t.nav.tools]}
          />
        </section>

        {/* TRUST ROW — slim, borderless reassurance. No card chrome, no overlap. */}
        <section className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-black/8 py-8 md:grid-cols-4">
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
            <div key={tile.title} className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 shrink-0 text-[#7c3aed]"
              >
                <path d={tile.icon} />
                {tile.extra}
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#1d1d1f]">
                  {tile.title}
                </p>
                <p className="text-xs text-[#6e6e73]">{tile.copy}</p>
              </div>
            </div>
          ))}
        </section>

        {/* DEPARTMENTS */}
        <section id="departments" className="scroll-mt-24">
          <SectionIntro
            eyebrow={t.categoryGrid.eyebrow}
            title={t.categoryGrid.title}
            subtitle={t.categoryGrid.subtitle}
            action={
              <Link
                href="/products"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
              >
                {t.categoryGrid.viewAll}
                <ArrowIcon />
              </Link>
            }
          />

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {featuredDepartments.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-4 rounded-lg border border-black/8 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-[#7c3aed] hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#7c3aed] transition-colors group-hover:bg-[#f3f0fe]">
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
                <p className="text-sm font-semibold text-[#1d1d1f]">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED COLLECTION BAND */}
        <section className="overflow-hidden rounded-xl bg-[#1d1d1f] text-white">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c4b5fd]">
                {t.featured.eyebrow}
              </p>
              <h2 className="mt-4 font-[family:var(--font-display)] text-3xl leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
                {t.featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                {t.featured.copy}
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
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
                        className="h-4 w-4 shrink-0 text-[#c4b5fd]"
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
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-[#f3f0fe] hover:text-[#6d28d9]"
              >
                {t.featured.cta}
                <ArrowIcon />
              </Link>
            </div>

            <div className="relative grid grid-cols-2 gap-4">
              {[
                { label: locale === "mn" ? "Хувцасны өрөө" : "Wardrobe", h: "h-44" },
                { label: locale === "mn" ? "Номын тавиур" : "Bookshelves", h: "h-32" },
                { label: locale === "mn" ? "Гараж" : "Garage", h: "h-32" },
                { label: locale === "mn" ? "Оффис" : "Office", h: "h-44" },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`flex ${card.h} flex-col justify-end rounded-lg border border-white/15 bg-white/8 p-4 backdrop-blur transition-all hover:bg-white/15`}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
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

        {/* PRODUCTS GRID */}
        <section>
          <SectionIntro
            eyebrow={t.products.eyebrow}
            title={t.products.title}
            subtitle={t.products.subtitle}
            action={
              <Link
                href="/products"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9]"
              >
                {t.products.viewAll}
                <ArrowIcon />
              </Link>
            }
          />

          {data.products.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.products.map((product) => {
                const image = getProductImage(product);

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-black/8 bg-white transition-all hover:-translate-y-1 hover:border-[#7c3aed]/40 hover:shadow-md"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      aria-label={product.name}
                      className="relative block aspect-square overflow-hidden bg-[#f5f5f7]"
                    >
                      {image ? (
                        <div
                          role="img"
                          aria-label={image.altText?.trim() || product.name}
                          className="absolute inset-6 rounded-lg bg-no-repeat transition-transform duration-300 group-hover:scale-[1.04]"
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
                      <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6d28d9] backdrop-blur">
                        {formatUnitLabel(product.baseUnit)}
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9b9ba3]">
                        {product.brand?.name ?? "Erka's"}
                      </p>
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#1d1d1f]">
                        <Link
                          href={`/products/${product.slug}`}
                          className="transition-colors hover:text-[#7c3aed]"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <p className="line-clamp-2 text-sm leading-6 text-[#6e6e73]">
                        {summarizeText(
                          product,
                          locale === "mn"
                            ? "Барааны дэлгэрэнгүй мэдээллийг каталогоос үзнэ үү."
                            : "See more details in the catalog.",
                        )}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/6 pt-4">
                        <span className="text-xs text-[#6e6e73]">
                          {t.products.sku}: {product.sku ?? "—"}
                        </span>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#7c3aed] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6d28d9]"
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
            <div className="mt-10 rounded-xl border border-dashed border-black/10 bg-[#f5f5f7] px-6 py-14 text-center">
              <h3 className="font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1d1d1f]">
                {t.products.emptyTitle}
              </h3>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/admin/products/new"
                  className="rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
                >
                  {t.products.addProduct}
                </Link>
                <Link
                  href="/products"
                  className="rounded-lg border border-black/10 px-6 py-3 text-sm font-medium text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
                >
                  {t.products.openCatalog}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/*
          BRAND STRIP — intentionally the quietest band on the page: it is social
          proof, not a destination, so it gets a calm surface and restrained type
          rather than competing with the product and department sections.
        */}
        <section className="rounded-lg border border-black/8 bg-[#f5f5f7] p-8 sm:p-12">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7c3aed]">
              {t.brands.eyebrow}
            </p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f] sm:text-3xl">
              {t.brands.title}
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {partnerBrands.map((brand) => (
              <div
                key={brand}
                className="flex h-16 items-center justify-center rounded-lg border border-black/8 bg-white text-sm font-[family:var(--font-display)] font-semibold tracking-[-0.02em] text-[#6e6e73] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
              >
                {brand}
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER — one calm, centered closing band. */}
        <section
          id="contact"
          className="scroll-mt-24 rounded-xl bg-[#f5f5f7] px-6 py-14 text-center sm:px-10 sm:py-16"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7c3aed]">
            {t.newsletter.eyebrow}
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-[family:var(--font-display)] text-3xl leading-[1.1] tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
            {t.newsletter.title}
          </h2>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder={t.newsletter.placeholder}
              className="flex-1 rounded-lg border border-black/10 bg-white px-5 py-3 text-sm text-[#1d1d1f] placeholder:text-[#9b9ba3] focus:border-[#7c3aed] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
            >
              {t.newsletter.button}
            </button>
          </form>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
