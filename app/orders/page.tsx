import Link from "next/link";
import type { Metadata } from "next";

import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { getUserOrders, isSignedIn } from "@/lib/orders";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { formatPrice } from "@/app/products/[slug]/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: `${t.orders.title} | Erka's` };
}

function statusClass(status: string) {
  if (status === "DELIVERED" || status === "PAID") return "bg-[#f0fdf4] text-[#166534]";
  if (status === "CANCELLED" || status === "REFUNDED" || status === "FAILED")
    return "bg-[#fef2f2] text-[#b91c1c]";
  if (status === "SHIPPED" || status === "READY_TO_SHIP" || status === "CONFIRMED")
    return "bg-[#f3f0fe] text-[#6d28d9]";
  return "bg-[#f5f5f7] text-[#6e6e73]";
}

export default async function OrdersPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [signedIn, orders] = await Promise.all([isSignedIn(), getUserOrders()]);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === "mn" ? "mn-MN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <PublicHeader current="products" />
      <div className="mx-auto w-full max-w-340 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-[family:var(--font-display)] text-3xl tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
          {t.orders.title}
        </h1>

        {!signedIn ? (
          <EmptyState
            title={t.orders.signInTitle}
            copy={t.orders.signInCopy}
            ctaHref="/sign-in"
            ctaLabel={t.orders.signIn}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title={t.orders.emptyTitle}
            copy={t.orders.emptyCopy}
            ctaHref="/products"
            ctaLabel={t.orders.browse}
          />
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-lg border border-black/8 bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 bg-[#f5f5f7] px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1f]">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-[#9b9ba3]">
                      {t.orders.placedOn}: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-lg px-3 py-1 text-[11px] font-semibold ${statusClass(order.status)}`}
                    >
                      {t.orders.status[order.status]}
                    </span>
                    <span
                      className={`rounded-lg px-3 py-1 text-[11px] font-semibold ${statusClass(order.paymentStatus)}`}
                    >
                      {t.orders.payment[order.paymentStatus]}
                    </span>
                  </div>
                </div>

                <ul className="divide-y divide-black/6 px-5">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 py-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-black/8 bg-[#f5f5f7]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            loading="lazy"
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-[#1d1d1f]">
                          {item.productName}
                          {item.variantTitle ? (
                            <span className="text-[#9b9ba3]"> · {item.variantTitle}</span>
                          ) : null}
                        </p>
                        <p className="text-xs text-[#6e6e73]">
                          {formatPrice(item.unitPrice, order.currency)} × {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-[#1d1d1f]">
                        {formatPrice(item.lineTotal, order.currency)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline justify-between border-t border-black/8 px-5 py-4">
                  <span className="text-sm font-semibold text-[#1d1d1f]">
                    {t.orders.total}
                  </span>
                  <span className="font-[family:var(--font-display)] text-xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                    {formatPrice(order.total, order.currency)}
                  </span>
                </div>
              </article>
            ))}
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
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
