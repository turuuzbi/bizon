import Link from "next/link";
import type { Metadata } from "next";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getCartView } from "@/lib/cart";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

import { CartClient } from "./CartClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: `${t.cart.title} | Erka's` };
}

export default async function CartPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const cart = await getCartView();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto w-full max-w-340 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
          {t.cart.title}
        </h1>

        {!cart.signedIn ? (
          <EmptyState
            title={t.cart.signInTitle}
            copy={t.cart.signInCopy}
            ctaHref="/sign-in"
            ctaLabel={t.cart.signIn}
          />
        ) : cart.items.length === 0 ? (
          <EmptyState
            title={t.cart.emptyTitle}
            copy={t.cart.emptyCopy}
            ctaHref="/products"
            ctaLabel={t.cart.browse}
          />
        ) : (
          <div className="mt-8">
            <CartClient
              items={cart.items}
              subtotal={cart.subtotal}
              currency={cart.currency}
              locale={locale}
            />
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}

function EmptyState({
  title,
  copy,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  copy: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-black/10 bg-[#f5f5f7] px-6 py-16 text-center">
      <h2 className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6e6e73]">{copy}</p>
      <Link
        href={ctaHref}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
