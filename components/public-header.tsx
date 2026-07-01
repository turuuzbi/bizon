import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { SiteAuthActions } from "@/components/site-auth-actions";
import { LanguageSwitcher } from "@/components/language-switcher";
<<<<<<< HEAD
import { getCartCount } from "@/lib/cart";
=======
import {
  CategoryMegaMenu,
  type MegaMenuCategory,
} from "@/components/marketplace/category-mega-menu";
import { HeaderActionBadges } from "@/components/marketplace/header-action-badges";
>>>>>>> c7d5ade (bizon)
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";

type PublicHeaderProps = {
  current: "home" | "products";
};

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

async function loadNavCategories(): Promise<{
  pills: NavCategory[];
  megaMenu: MegaMenuCategory[];
}> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        _count: { select: { primaryProducts: true } },
      },
    });

    const countById = new Map(
      categories.map((category) => [category.id, category._count.primaryProducts]),
    );
    const childrenByParent = new Map<string, typeof categories>();
    for (const category of categories) {
      if (!category.parentId) continue;
      childrenByParent.set(category.parentId, [
        ...(childrenByParent.get(category.parentId) ?? []),
        category,
      ]);
    }

    const topLevel = categories.filter((category) => !category.parentId);

    const megaMenu: MegaMenuCategory[] = topLevel.map((top) => {
      const children = childrenByParent.get(top.id) ?? [];
      const childCount = children.reduce(
        (sum, child) => sum + (countById.get(child.id) ?? 0),
        0,
      );
      return {
        id: top.id,
        name: top.name,
        slug: top.slug,
        count: (countById.get(top.id) ?? 0) + childCount,
        children: children.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })),
      };
    });

    const pills: NavCategory[] = megaMenu
      .filter((category) => category.count > 0)
      .slice(0, 8)
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category.count,
      }));

    return { pills, megaMenu };
  } catch {
    return { pills: [], megaMenu: [] };
  }
}

export async function PublicHeader({ current }: PublicHeaderProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
<<<<<<< HEAD
  const [categories, cartCount] = await Promise.all([
    loadNavCategories(),
    getCartCount(),
  ]);
=======
  const { pills, megaMenu } = await loadNavCategories();
>>>>>>> c7d5ade (bizon)

  const fallbackNav: NavCategory[] = [
    { id: "home", name: t.nav.home, slug: "home-living", count: 0 },
    { id: "timber", name: t.nav.timber, slug: "timber-and-board", count: 0 },
    { id: "building", name: t.nav.building, slug: "building-materials", count: 0 },
    { id: "paint", name: t.nav.paint, slug: "paint-and-finish", count: 0 },
    { id: "tile", name: t.nav.tile, slug: "tile-and-stone", count: 0 },
    { id: "tools", name: t.nav.tools, slug: "tools-and-site", count: 0 },
  ];

  const navItems = pills.length > 0 ? pills : fallbackNav;

  return (
<<<<<<< HEAD
    <header className="border-b border-black/8 bg-white">
      {/* Utility bar */}
      <div className="bg-[#1d1d1f] text-white">
        <div className="mx-auto flex w-full max-w-340 flex-wrap items-center justify-between gap-3 px-4 py-2 text-[11px] sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-white/70">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
=======
    <header className="sticky top-0 z-50 border-b border-[#e4e4e7] bg-white">
      {/* Compact utility bar */}
      <div className="hidden bg-[#18181b] text-white sm:block">
        <div className="mx-auto flex w-full max-w-340 items-center justify-between gap-3 px-4 py-1 text-[11px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-4 text-white/70">
            <span className="inline-flex items-center gap-1.5">
>>>>>>> c7d5ade (bizon)
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {t.utility.hours}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {t.utility.contact}
            </span>
          </div>
          <LanguageSwitcher current={locale} variant="utility" />
        </div>
      </div>

<<<<<<< HEAD
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
              <span className="font-[family:var(--font-display)] text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                Erka&apos;s
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7c3aed]">
                Building Materials
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/products"
              aria-label={t.header.favorites}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#1d1d1f] hover:border-[#7c3aed] hover:text-[#7c3aed]"
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
              href="/cart"
              aria-label={t.header.cart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
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
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-lg bg-[#1d1d1f] px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
=======
      {/* Logo + search + actions row */}
      <div className="mx-auto flex w-full max-w-340 items-center gap-3 px-4 py-2.5 sm:px-6 lg:gap-6 lg:px-8">
        <Link
          href="/"
          aria-label="Erka's home"
          className="flex shrink-0 items-center gap-2"
        >
          <BrandLogo size="sm" priority={current === "home"} className="h-8 w-auto sm:h-9" />
          <span className="hidden flex-col leading-tight md:flex">
            <span className="font-[family:var(--font-display)] text-base font-semibold tracking-[-0.02em] text-[#18181b]">
              Erka&apos;s
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8e55cf]">
              Building Materials
            </span>
          </span>
        </Link>
>>>>>>> c7d5ade (bizon)

        <form
          action="/products"
          method="GET"
<<<<<<< HEAD
          className="flex w-full items-center overflow-hidden rounded-full border border-black/10 bg-[#f5f5f7] focus-within:border-[#7c3aed] focus-within:bg-white lg:flex-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-4 h-4 w-4 text-[#9b9ba3]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
=======
          className="flex h-10 w-full max-w-2xl flex-1 items-center overflow-hidden rounded-[8px] border border-[#d4d4d8] bg-white focus-within:border-[#8e55cf] focus-within:ring-1 focus-within:ring-[#8e55cf]/30 sm:mx-auto"
        >
          <label className="hidden h-full shrink-0 items-center border-r border-[#e4e4e7] bg-[#f6f6f7] sm:flex">
            <span className="sr-only">{t.marketplace.allCategories}</span>
            <select
              name="category"
              defaultValue=""
              className="h-full max-w-[140px] bg-transparent px-2.5 text-xs font-medium text-[#3f3f46] outline-none"
            >
              <option value="">{t.marketplace.allCategories}</option>
              {navItems.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
>>>>>>> c7d5ade (bizon)
          <input
            type="search"
            name="q"
            placeholder={t.header.searchPlaceholder}
<<<<<<< HEAD
            className="flex-1 bg-transparent px-3 py-3 text-sm text-[#1d1d1f] placeholder:text-[#9b9ba3] focus:outline-none"
          />
          <button
            type="submit"
            className="my-1 mr-1 rounded-lg bg-[#7c3aed] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#6d28d9]"
          >
            {t.header.searchButton}
          </button>
        </form>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/products"
            aria-label={t.header.favorites}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
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
            href="/cart"
            className="flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
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
            {cartCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-lg bg-white px-1 text-[10px] font-semibold text-[#7c3aed]">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <SiteAuthActions />
        </div>
      </div>

      {/* Mega-nav category bar */}
      <nav className="border-t border-black/8 bg-[#f5f5f7]">
        <div className="mx-auto flex w-full max-w-340 items-center gap-1 overflow-x-auto px-4 py-2 text-sm sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#6d28d9]"
=======
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t.header.searchButton}
            className="flex h-full items-center gap-1.5 bg-[#8e55cf] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#7d45c1]"
>>>>>>> c7d5ade (bizon)
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="hidden sm:inline">{t.header.searchButton}</span>
          </button>
        </form>

        <div className="flex shrink-0 items-center gap-2.5">
          <HeaderActionBadges compact />
          <div className="hidden lg:block">
            <SiteAuthActions />
          </div>
        </div>
      </div>

      {/* Category navigation: hoverable mega menu + compact pills */}
      <nav className="border-t border-[#e4e4e7] bg-white">
        <div className="mx-auto flex w-full max-w-340 items-center gap-1.5 overflow-x-auto px-4 py-1.5 sm:px-6 lg:px-8">
          <CategoryMegaMenu label={t.marketplace.departments} categories={megaMenu} />
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/products?category=${item.slug}`}
<<<<<<< HEAD
              className="shrink-0 rounded-lg px-3.5 py-2 text-sm text-[#44444c] transition-colors hover:bg-white hover:text-[#7c3aed]"
=======
              className="shrink-0 rounded-[8px] px-3 py-1.5 text-sm text-[#3f3f46] transition-colors hover:bg-[#f6f6f7] hover:text-[#8e55cf]"
>>>>>>> c7d5ade (bizon)
            >
              {item.name}
              {item.count > 0 ? (
                <span className="ml-1 text-xs text-[#a1a1aa]">({item.count})</span>
              ) : null}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
