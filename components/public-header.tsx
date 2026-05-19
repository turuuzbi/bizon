import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { SiteAuthActions } from "@/components/site-auth-actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";

type PublicHeaderProps = {
  current: "home" | "products";
};

const navIconSize = "h-[18px] w-[18px]";

async function loadNavCategories() {
  try {
    return await prisma.category.findMany({
      where: {
        OR: [
          { primaryProducts: { some: {} } },
          { productCategories: { some: {} } },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 8,
      select: { id: true, name: true, slug: true },
    });
  } catch {
    return [];
  }
}

export async function PublicHeader({ current }: PublicHeaderProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const categories = await loadNavCategories();

  const fallbackNav: Array<{ id: string; name: string; slug: string }> = [
    { id: "new", name: t.nav.newArrivals, slug: "new-arrivals" },
    { id: "brands", name: t.nav.brands, slug: "brands" },
    { id: "home", name: t.nav.home, slug: "home-living" },
    { id: "timber", name: t.nav.timber, slug: "timber-and-board" },
    { id: "building", name: t.nav.building, slug: "building-materials" },
    { id: "paint", name: t.nav.paint, slug: "paint-and-finish" },
    { id: "tile", name: t.nav.tile, slug: "tile-and-stone" },
    { id: "tools", name: t.nav.tools, slug: "tools-and-site" },
  ];

  const navItems = categories.length > 0 ? categories : fallbackNav;

  return (
    <header className="border-b border-black/8 bg-white">
      {/* Utility bar */}
      <div className="bg-[#1f1828] text-white">
        <div className="mx-auto flex w-full max-w-340 flex-wrap items-center justify-between gap-3 px-4 py-2 text-[11px] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/70">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {t.utility.hours}
            </span>
            <span className="hidden items-center gap-1.5 lg:inline-flex">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M1 3h15v13H1z" />
                <path d="M16 8h4l3 3v5h-7z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              {t.utility.delivery}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {t.utility.contact}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-white/60 sm:flex">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5 3.66 9.13 8.44 9.87v-6.98H7.9v-2.89h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.77l-.44 2.89h-2.33V22c4.78-.74 8.43-4.87 8.43-9.93z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.94c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.82-.39.39-.63.76-.82 1.27-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.82 1.27.39.39.76.63 1.27.82.39.15.97.33 2.04.38 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.82.39-.39.63-.76.82-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.82-1.27 3.4 3.4 0 0 0-1.27-.82c-.39-.15-.97-.33-2.04-.38C15.5 4.11 15.15 4.1 12 4.1zm0 3.3a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 1.94a2.66 2.66 0 1 0 0 5.32 2.66 2.66 0 0 0 0-5.32zm5.85-2.18a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z" />
                </svg>
              </a>
            </div>
            <LanguageSwitcher current={locale} variant="utility" />
          </div>
        </div>
      </div>

      {/* Logo + search + auth row */}
      <div className="mx-auto flex w-full max-w-340 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:px-8 lg:py-5">
        <div className="flex items-center justify-between gap-4 lg:justify-start">
          <Link
            href="/"
            aria-label="Erka's home"
            className="flex items-center gap-3"
          >
            <BrandLogo
              size="sm"
              priority={current === "home"}
              className="h-12 w-auto sm:h-14"
            />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-[family:var(--font-display)] text-xl font-semibold tracking-[-0.03em] text-[#1f1828]">
                Erka&apos;s
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8e55cf]">
                Building Materials
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/products"
              aria-label={t.header.favorites}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#1f1828] hover:border-[#8e55cf] hover:text-[#8e55cf]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={navIconSize}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>
            <Link
              href="/products"
              aria-label={t.header.cart}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8e55cf] text-white hover:bg-[#7d45c1]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={navIconSize}
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>
          </div>
        </div>

        <form
          action="/products"
          method="GET"
          className="flex w-full items-center overflow-hidden rounded-full border border-black/10 bg-[#f6f1eb] focus-within:border-[#8e55cf] focus-within:bg-white lg:flex-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-4 h-4 w-4 text-[#7b7088]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            name="q"
            placeholder={t.header.searchPlaceholder}
            className="flex-1 bg-transparent px-3 py-3 text-sm text-[#1f1828] placeholder:text-[#7b7088] focus:outline-none"
          />
          <button
            type="submit"
            className="my-1 mr-1 rounded-full bg-[#8e55cf] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#7d45c1]"
          >
            {t.header.searchButton}
          </button>
        </form>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/products"
            aria-label={t.header.favorites}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#1f1828] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={navIconSize}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full bg-[#8e55cf] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={navIconSize}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {t.header.cart}
          </Link>
          <SiteAuthActions />
        </div>
      </div>

      {/* Mega-nav category bar */}
      <nav className="border-t border-black/8 bg-[#fbf8f4]">
        <div className="mx-auto flex w-full max-w-340 items-center gap-1 overflow-x-auto px-4 py-2 text-sm sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#8e55cf] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#7d45c1]"
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
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            {t.nav.departments}
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/products?category=${item.slug}`}
              className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#3a323f] transition-colors hover:bg-white hover:text-[#8e55cf]"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
