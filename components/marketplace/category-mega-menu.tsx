"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type MegaMenuCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
  children: Array<{ id: string; name: string; slug: string }>;
};

type CategoryMegaMenuProps = {
  label: string;
  categories: MegaMenuCategory[];
};

export function CategoryMegaMenu({ label, categories }: CategoryMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (categories.length === 0) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative shrink-0"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-sm font-semibold transition-colors ${
          isOpen
            ? "bg-[#18181b] text-white"
            : "bg-[#18181b] text-white hover:bg-[#3f3f46]"
        }`}
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
        {label}
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-[min(90vw,640px)] rounded-[10px] border border-[#e4e4e7] bg-white p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/products?category=${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-[#18181b] hover:text-[#8e55cf]"
                >
                  {category.name}
                  <span className="ml-1 text-xs font-normal text-[#a1a1aa]">
                    ({category.count})
                  </span>
                </Link>
                {category.children.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/products?category=${child.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-sm text-[#71717a] hover:text-[#8e55cf]"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
