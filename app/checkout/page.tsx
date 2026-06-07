import Link from "next/link";
import type { Metadata } from "next";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentAppUser } from "@/lib/auth";
import { getCartView } from "@/lib/cart";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { formatPrice } from "@/app/products/[slug]/types";

import { placeOrderAction } from "./actions";
import { SubmitButton } from "./SubmitButton";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: `${t.checkout.title} | Erka's` };
}

const inputClass =
  "mt-2 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition-colors focus:border-[#7c3aed]";

export default async function CheckoutPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [cart, user] = await Promise.all([getCartView(), getCurrentAppUser()]);

  const defaultName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "";

  const blocked = !cart.signedIn || cart.items.length === 0;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto w-full max-w-340 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
          {t.checkout.title}
        </h1>

        {blocked ? (
          <div className="mt-8 rounded-lg border border-dashed border-black/10 bg-[#f5f5f7] px-6 py-16 text-center">
            <h2 className="font-[family:var(--font-display)] text-2xl tracking-[-0.04em] text-[#1d1d1f]">
              {cart.signedIn ? t.checkout.emptyTitle : t.cart.signInTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6e6e73]">
              {cart.signedIn ? t.checkout.emptyCopy : t.cart.signInCopy}
            </p>
            <Link
              href={cart.signedIn ? "/products" : "/sign-in"}
              className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
            >
              {cart.signedIn ? t.checkout.viewProducts : t.cart.signIn}
            </Link>
          </div>
        ) : (
          <form
            action={placeOrderAction}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
          >
            {/* Address form */}
            <div className="space-y-6">
              <section className="rounded-lg border border-black/8 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#6d28d9]">
                  {t.checkout.contactTitle}
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.recipientName}
                    </span>
                    <input
                      name="recipientName"
                      required
                      defaultValue={defaultName}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.phone}
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={user?.phone ?? ""}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-lg border border-black/8 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-[#6d28d9]">
                  {t.checkout.shippingTitle}
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.city}
                    </span>
                    <input name="city" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.district}
                    </span>
                    <input name="district" className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.line1}
                    </span>
                    <input name="line1" required className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.line2}
                    </span>
                    <input name="line2" className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-[#1d1d1f]">
                      {t.checkout.note}
                    </span>
                    <textarea
                      name="note"
                      rows={3}
                      placeholder={t.checkout.notePlaceholder}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-lg border border-black/8 bg-white p-6 lg:sticky lg:top-6">
              <h2 className="text-sm font-semibold text-[#1d1d1f]">
                {t.checkout.summaryTitle}
              </h2>
              <ul className="mt-4 space-y-3 border-b border-black/8 pb-4">
                {cart.items.map((line) => (
                  <li key={line.id} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 text-[#3a3a42]">
                      <span className="line-clamp-1">{line.name}</span>
                      <span className="text-xs text-[#9b9ba3]">× {line.quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium text-[#1d1d1f]">
                      {formatPrice(line.lineTotal, cart.currency)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#6e6e73]">{t.checkout.subtotal}</dt>
                  <dd className="font-medium text-[#1d1d1f]">
                    {formatPrice(cart.subtotal, cart.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6e6e73]">{t.checkout.shipping}</dt>
                  <dd className="text-[#9b9ba3]">{t.checkout.shippingTbd}</dd>
                </div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-black/8 pt-4">
                <span className="text-sm font-semibold text-[#1d1d1f]">
                  {t.checkout.total}
                </span>
                <span className="font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                  {formatPrice(cart.subtotal, cart.currency)}
                </span>
              </div>

              <div className="mt-6">
                <SubmitButton
                  label={t.checkout.placeOrder}
                  pendingLabel={t.checkout.placing}
                />
              </div>
              <p className="mt-3 rounded-lg bg-[#f3f0fe] px-4 py-3 text-xs leading-5 text-[#6d28d9]">
                {t.checkout.paymentNote}
              </p>
              <Link
                href="/cart"
                className="mt-3 flex w-full items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium text-[#6e6e73] transition-colors hover:text-[#7c3aed]"
              >
                {t.checkout.backToCart}
              </Link>
            </aside>
          </form>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
