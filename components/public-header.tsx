import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { SiteAuthActions } from "@/components/site-auth-actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  CategoryMegaMenu,
  type MegaMenuCategory,
} from "@/components/marketplace/category-mega-menu";
import { HeaderActionBadges } from "@/components/marketplace/header-action-badges";
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
  const { pills, megaMenu } = await loadNavCategories();

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
    <header className="sticky top-0 z-50 border-b border-[#e4e4e7] bg-white">
      {/* Compact utility bar */}
      <div className="hidden bg-[#18181b] text-white sm:block">
        <div className="mx-auto flex w-full max-w-340 items-center justify-between gap-3 px-4 py-1 text-[11px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-4 text-white/70">
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

        <form
          action="/products"
          method="GET"
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
          <input
            type="search"
            name="q"
            placeholder={t.header.searchPlaceholder}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none"
          />
          <button
            type="submit"
            aria-label={t.header.searchButton}
            className="flex h-full items-center gap-1.5 bg-[#8e55cf] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#7d45c1]"
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
              className="shrink-0 rounded-[8px] px-3 py-1.5 text-sm text-[#3f3f46] transition-colors hover:bg-[#f6f6f7] hover:text-[#8e55cf]"
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
