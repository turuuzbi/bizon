import Link from "next/link";
import type { Metadata } from "next";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: `${t.checkout.successTitle} | Erka's` };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { order } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto flex w-full max-w-340 flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h1 className="mt-6 font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
          {t.checkout.successTitle}
        </h1>
        <p className="mt-3 max-w-md text-base leading-7 text-[#6e6e73]">
          {t.checkout.successCopy}
        </p>
        {order ? (
          <p className="mt-6 rounded-lg border border-black/8 bg-[#f5f5f7] px-5 py-3 text-sm text-[#3a3a42]">
            {t.checkout.orderNumber}:{" "}
            <span className="font-semibold text-[#1d1d1f]">{order}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/orders"
            className="rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
          >
            {t.orders.title}
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-black/10 px-6 py-3 text-sm font-medium text-[#1d1d1f] transition-colors hover:border-[#7c3aed] hover:text-[#7c3aed]"
          >
            {t.checkout.viewProducts}
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
