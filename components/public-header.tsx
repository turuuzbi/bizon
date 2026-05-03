import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { SiteAuthActions } from "@/components/site-auth-actions";

type PublicHeaderProps = {
  current: "home" | "products";
};

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Trade support", href: "/#trade" },
  { label: "Project notes", href: "/#contact" },
] as const;

export function PublicHeader({ current }: PublicHeaderProps) {
  return (
    <header className="rounded-[30px] border border-black/8 bg-[#fffdf9]/95 px-4 py-4 shadow-[0_24px_60px_rgba(28,23,19,0.05)] backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7b7088]">
              Ulaanbaatar supply
            </p>
            <p className="mt-2 text-sm text-[#655c69]">
              Materials, finishes, and site essentials without the clutter.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/" aria-label="Go to Erka's home">
              <BrandLogo
                size="md"
                priority={current === "home"}
                className="h-auto w-[92px] sm:w-[104px]"
              />
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <SiteAuthActions />
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 border-t border-black/6 pt-3">
          {navigationItems.map((item) => {
            const isActive =
              (current === "home" && item.href === "/") ||
              (current === "products" && item.href === "/products");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[#efe7fb] font-semibold text-[#7e4cb8]"
                    : "text-[#4f4854] hover:bg-[#f4efe8] hover:text-[#1f1a23]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
