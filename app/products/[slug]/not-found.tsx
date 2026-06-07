import Link from "next/link";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function ProductNotFound() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto flex w-full max-w-340 flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#f3f0fe] text-[#7c3aed]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <h1 className="mt-6 font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
          {t.pdp.notFoundTitle}
        </h1>
        <p className="mt-3 max-w-md text-base leading-7 text-[#6e6e73]">
          {t.pdp.notFoundCopy}
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
        >
          {t.pdp.backToCatalog}
        </Link>
      </div>
      <SiteFooter />
    </main>
  );
}
