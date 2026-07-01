"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { useT } from "@/components/locale-provider";

type FacetOption = { slug: string; name: string; count: number };

type FiltersSidebarProps = {
  categories: FacetOption[];
  brands: FacetOption[];
  selectedCategories: string[];
  selectedBrands: string[];
  stock: "in" | "out" | "";
  featured: boolean;
  newArrivals: boolean;
  searchValue: string;
  inStockCount: number;
  outOfStockCount: number;
};

const BRAND_PREVIEW_COUNT = 8;

export function FiltersSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  stock,
  featured,
  newArrivals,
  searchValue,
  inStockCount,
  outOfStockCount,
}: FiltersSidebarProps) {
  const t = useT();
  const tf = t.marketplace.filters;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [searchDraft, setSearchDraft] = useState(searchValue);

  function navigate(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function toggleMultiValue(key: string, value: string) {
    navigate((params) => {
      const current = params.getAll(key);
      params.delete(key);
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      next.forEach((entry) => params.append(key, entry));
    });
  }

  function setSingleValue(key: string, value: string) {
    navigate((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function toggleFlag(key: string, active: boolean) {
    navigate((params) => {
      if (active) {
        params.delete(key);
      } else {
        params.set(key, "1");
      }
    });
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    navigate((params) => {
      const trimmed = searchDraft.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
    });
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    stock !== "" ||
    featured ||
    newArrivals ||
    searchValue !== "";

  const visibleBrands = showAllBrands ? brands : brands.slice(0, BRAND_PREVIEW_COUNT);

  return (
    <aside className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#18181b]">
          {tf.title}
        </h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="text-xs font-medium text-[#8e55cf] hover:text-[#7d45c1]"
          >
            {tf.clearAll}
          </button>
        ) : null}
      </div>

      <form onSubmit={submitSearch} className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-[#3f3f46]">
          {tf.searchWithin}
        </span>
        <div className="flex items-center overflow-hidden rounded-[8px] border border-[#e4e4e7] bg-white focus-within:border-[#8e55cf]">
          <input
            type="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder={tf.searchWithinPlaceholder}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#18181b] outline-none placeholder:text-[#a1a1aa]"
          />
          <button
            type="submit"
            aria-label={tf.searchWithin}
            className="px-3 text-[#71717a] hover:text-[#8e55cf]"
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
          </button>
        </div>
      </form>

      {categories.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-[#e4e4e7] pt-4">
          <span className="text-xs font-semibold text-[#3f3f46]">
            {tf.categories}
          </span>
          <ul className="flex flex-col gap-1.5">
            {categories.map((category) => {
              const checked = selectedCategories.includes(category.slug);
              return (
                <li key={category.slug}>
                  <label className="flex items-center justify-between gap-2 text-sm text-[#3f3f46] hover:text-[#18181b]">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMultiValue("category", category.slug)}
                        className="h-3.5 w-3.5 accent-[#8e55cf]"
                      />
                      {category.name}
                    </span>
                    <span className="text-xs text-[#a1a1aa]">{category.count}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-[#e4e4e7] pt-4">
        <span className="text-xs font-semibold text-[#3f3f46]">{tf.brands}</span>
        {brands.length > 0 ? (
          <>
            <ul className="flex flex-col gap-1.5">
              {visibleBrands.map((brand) => {
                const checked = selectedBrands.includes(brand.slug);
                return (
                  <li key={brand.slug}>
                    <label className="flex items-center justify-between gap-2 text-sm text-[#3f3f46] hover:text-[#18181b]">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMultiValue("brand", brand.slug)}
                          className="h-3.5 w-3.5 accent-[#8e55cf]"
                        />
                        {brand.name}
                      </span>
                      <span className="text-xs text-[#a1a1aa]">{brand.count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {brands.length > BRAND_PREVIEW_COUNT ? (
              <button
                type="button"
                onClick={() => setShowAllBrands((current) => !current)}
                className="text-left text-xs font-medium text-[#8e55cf] hover:text-[#7d45c1]"
              >
                {showAllBrands ? tf.showLess : tf.showMore}
              </button>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-[#a1a1aa]">{tf.noBrands}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-[#e4e4e7] pt-4">
        <span className="text-xs font-semibold text-[#3f3f46]">
          {tf.availability}
        </span>
        <label className="flex items-center justify-between gap-2 text-sm text-[#3f3f46] hover:text-[#18181b]">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={stock === "in"}
              onChange={() => setSingleValue("stock", stock === "in" ? "" : "in")}
              className="h-3.5 w-3.5 accent-[#8e55cf]"
            />
            {tf.inStock}
          </span>
          <span className="text-xs text-[#a1a1aa]">{inStockCount}</span>
        </label>
        <label className="flex items-center justify-between gap-2 text-sm text-[#3f3f46] hover:text-[#18181b]">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={stock === "out"}
              onChange={() => setSingleValue("stock", stock === "out" ? "" : "out")}
              className="h-3.5 w-3.5 accent-[#8e55cf]"
            />
            {tf.outOfStock}
          </span>
          <span className="text-xs text-[#a1a1aa]">{outOfStockCount}</span>
        </label>
      </div>

      <div className="flex flex-col gap-2 border-t border-[#e4e4e7] pt-4">
        <span className="text-xs font-semibold text-[#3f3f46]">
          {tf.promotions}
        </span>
        <label className="flex items-center gap-2 text-sm text-[#3f3f46] hover:text-[#18181b]">
          <input
            type="checkbox"
            checked={featured}
            onChange={() => toggleFlag("featured", featured)}
            className="h-3.5 w-3.5 accent-[#8e55cf]"
          />
          {tf.featured}
        </label>
        <label className="flex items-center gap-2 text-sm text-[#3f3f46] hover:text-[#18181b]">
          <input
            type="checkbox"
            checked={newArrivals}
            onChange={() => toggleFlag("new", newArrivals)}
            className="h-3.5 w-3.5 accent-[#8e55cf]"
          />
          {tf.newArrivals}
        </label>
      </div>
    </aside>
  );
}
