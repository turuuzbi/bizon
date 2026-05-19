import Link from "next/link";
import { OrderStatus, ProductStatus } from "@prisma/client";

import { formatString, getDictionary, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null, locale: Locale, notSet: string) {
  if (!date) return notSet;
  return new Intl.DateTimeFormat(locale === "mn" ? "mn-MN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: string, locale: Locale) {
  const fmt = new Intl.NumberFormat(locale === "mn" ? "mn-MN" : "en-US").format(
    Number(value),
  );
  return locale === "mn" ? `${fmt} ₮` : `${fmt} MNT`;
}

async function getOverviewData() {
  try {
    const [
      totalUsers,
      adminUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      categoryCount,
      brandCount,
      recentUsers,
      recentOrders,
      recentProducts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: {
            in: [
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.PROCESSING,
            ],
          },
        },
      }),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
          isActive: true,
        },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        select: {
          id: true,
          name: true,
          status: true,
          sku: true,
          updatedAt: true,
          isFeatured: true,
        },
      }),
    ]);

    return {
      ok: true as const,
      summary: {
        totalUsers,
        adminUsers,
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        categoryCount,
        brandCount,
      },
      recentUsers,
      recentOrders,
      recentProducts,
    };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : null,
    };
  }
}

export default async function AdminPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const tOverview = t.admin.overview;
  const overview = await getOverviewData();

  if (!overview.ok) {
    return (
      <main className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
          {tOverview.databaseSetup}
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17]">
          {tOverview.dataNotReadyTitle}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
          {tOverview.dataNotReadyCopy}
        </p>
        <div className="mt-8 rounded-[28px] border border-black/10 bg-[#f6f1ea] p-5 text-sm leading-7 text-[#4f4a43]">
          <p>`npm run prisma:generate`</p>
          <p>`npm run db:push`</p>
          {overview.message ? (
            <p className="mt-3 text-[#625f5a]">{overview.message}</p>
          ) : null}
        </div>
      </main>
    );
  }

  const metricCards = [
    {
      label: tOverview.products,
      value: overview.summary.totalProducts,
      note: formatString(tOverview.productsNote, {
        count: overview.summary.activeProducts,
      }),
    },
    {
      label: tOverview.orders,
      value: overview.summary.totalOrders,
      note: formatString(tOverview.ordersNote, {
        count: overview.summary.pendingOrders,
      }),
    },
    {
      label: tOverview.customers,
      value: overview.summary.totalUsers,
      note: formatString(tOverview.customersNote, {
        count: overview.summary.adminUsers,
      }),
    },
    {
      label: tOverview.catalogGroups,
      value: overview.summary.categoryCount,
      note: formatString(tOverview.catalogNote, {
        count: overview.summary.brandCount,
      }),
    },
  ];

  return (
    <main className="flex flex-col gap-6">
      <section
        id="overview"
        className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7f7391]">
              {tOverview.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17] sm:text-5xl">
              {tOverview.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
              {tOverview.copy}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[28px] border border-black/10 bg-[#f6f1ea] px-5 py-4 text-sm leading-7 whitespace-pre-line text-[#4f4a43]">
              {tOverview.authBlock}
            </div>
            <Link
              href="/admin/products"
              className="inline-flex rounded-full bg-[#8e55cf] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
            >
              {tOverview.openProductOps}
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[28px] border border-black/[0.08] bg-[#f6f1ea] p-5"
            >
              <p className="text-sm font-medium text-[#625f5a]">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#536458]">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div
          id="catalog"
          className="rounded-[36px] border border-black/10 bg-[#fffcf8] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
            {tOverview.catalogActivity}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17] sm:text-4xl">
            {tOverview.recentlyUpdatedProducts}
          </h2>
          <div className="mt-8 space-y-3">
            {overview.recentProducts.length > 0 ? (
              overview.recentProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[24px] border border-black/[0.08] bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1d1a17]">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#625f5a]">
                        {tOverview.sku}: {product.sku ?? tOverview.notSet}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#efe4fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d36ad]">
                        {t.productStatus[product.status]}
                      </span>
                      {product.isFeatured ? (
                        <span className="rounded-full bg-[#efe4d3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5f3d]">
                          {tOverview.featured}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#625f5a]">
                    {tOverview.updated}{" "}
                    {formatDate(product.updatedAt, locale, tOverview.notSet)}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-5 py-6 text-sm leading-7 text-[#625f5a]">
                {tOverview.noProductsYet}
              </div>
            )}
          </div>
        </div>

        <div
          id="orders"
          className="rounded-[36px] border border-black/10 bg-[#f1ece4] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
            {tOverview.orderDesk}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
            {tOverview.latestOrderFlow}
          </h2>
          <div className="mt-8 space-y-3">
            {overview.recentOrders.length > 0 ? (
              overview.recentOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[24px] border border-black/[0.08] bg-white px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1d1a17]">
                        {order.orderNumber}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#625f5a]">
                        {formatMoney(order.totalAmount.toString(), locale)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#efe4fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d36ad]">
                      {t.orderStatus[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#625f5a]">
                    {tOverview.created}{" "}
                    {formatDate(order.createdAt, locale, tOverview.notSet)}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-5 py-6 text-sm leading-7 text-[#625f5a]">
                {tOverview.ordersAppearHere}
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="customers"
        className="rounded-[36px] bg-[linear-gradient(180deg,#4a2a70_0%,#7d45c1_100%)] p-8 text-[#f8f2ff] shadow-[0_24px_60px_rgba(77,41,116,0.24)] sm:p-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#dccbf4]">
              {tOverview.customerAccess}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f8f2ff] sm:text-5xl">
              {tOverview.recentUsersTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#ece1fb] sm:text-lg">
              {tOverview.recentUsersCopy}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {overview.recentUsers.length > 0 ? (
            overview.recentUsers.map((user) => {
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.email ||
                tOverview.unnamedUser;

              return (
                <article
                  key={user.id}
                  className="rounded-[24px] border border-white/[0.12] bg-white/[0.08] px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#f8f2ff]">
                        {fullName}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#ece1fb]">
                        {user.email ?? tOverview.noEmailOnFile}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d36ad]">
                        {user.role}
                      </span>
                      <span className="rounded-full border border-white/[0.16] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f8f2ff]">
                        {user.isActive ? tOverview.active : tOverview.disabled}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#ece1fb]">
                    {tOverview.joined}{" "}
                    {formatDate(user.createdAt, locale, tOverview.notSet)}
                  </p>
                </article>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-white/[0.12] bg-white/[0.08] px-5 py-6 text-sm leading-7 text-[#ece1fb]">
              {tOverview.noSyncedUsers}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
