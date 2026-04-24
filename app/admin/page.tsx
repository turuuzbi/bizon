import Link from "next/link";
import { OrderStatus, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: string) {
  return `${new Intl.NumberFormat("en-US").format(Number(value))} MNT`;
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
      message:
        error instanceof Error
          ? error.message
          : "The admin dashboard could not load the database.",
    };
  }
}

export default async function AdminPage() {
  const overview = await getOverviewData();

  if (!overview.ok) {
    return (
      <main className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
          Database setup
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17]">
          The admin shell is live, but the data layer is not ready yet.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
          Connect Prisma to your Neon database and make sure the schema has been
          pushed before loading dashboard data.
        </p>
        <div className="mt-8 rounded-[28px] border border-black/10 bg-[#f6f1ea] p-5 text-sm leading-7 text-[#4f4a43]">
          <p>`npm run prisma:generate`</p>
          <p>`npm run db:push`</p>
          <p className="mt-3 text-[#625f5a]">{overview.message}</p>
        </div>
      </main>
    );
  }

  const metricCards = [
    {
      label: "Products",
      value: overview.summary.totalProducts,
      note: `${overview.summary.activeProducts} active`,
    },
    {
      label: "Orders",
      value: overview.summary.totalOrders,
      note: `${overview.summary.pendingOrders} in progress`,
    },
    {
      label: "Customers",
      value: overview.summary.totalUsers,
      note: `${overview.summary.adminUsers} admins`,
    },
    {
      label: "Catalog groups",
      value: overview.summary.categoryCount,
      note: `${overview.summary.brandCount} brands`,
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
              Overview
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17] sm:text-5xl">
              Real data, server-side role checks, and a ready admin foundation.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
              This dashboard reads directly from your Prisma schema so the first
              version already works as a real control panel instead of a static
              mock.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[28px] border border-black/10 bg-[#f6f1ea] px-5 py-4 text-sm leading-7 text-[#4f4a43]">
              <p>Auth: Clerk</p>
              <p>Roles: Prisma `User.role`</p>
              <p>Bootstrap admin: `ADMIN_EMAILS` or `ADMIN_CLERK_USER_IDS`</p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex rounded-full bg-[#24362f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1c2924]"
            >
              Open product operations
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
            Catalog activity
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17] sm:text-4xl">
            Recently updated products
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
                        SKU: {product.sku ?? "Not set"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#eff2ed] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#536458]">
                        {product.status}
                      </span>
                      {product.isFeatured ? (
                        <span className="rounded-full bg-[#efe4d3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5f3d]">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#625f5a]">
                    Updated {formatDate(product.updatedAt)}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-5 py-6 text-sm leading-7 text-[#625f5a]">
                No products yet. Once catalog items are added, they will appear
                here automatically.
              </div>
            )}
          </div>
        </div>

        <div
          id="orders"
          className="rounded-[36px] border border-black/10 bg-[#f1ece4] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
            Order desk
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
            Latest order flow
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
                        {formatMoney(order.totalAmount.toString())}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#eff2ed] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#536458]">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[#625f5a]">
                    Created {formatDate(order.createdAt)}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-5 py-6 text-sm leading-7 text-[#625f5a]">
                Orders will appear here as soon as checkout starts writing data.
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="customers"
        className="rounded-[36px] bg-[#24362f] p-8 text-[#f7f2ea] shadow-[0_24px_60px_rgba(24,36,31,0.18)] sm:p-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c7bf]">
              Customer access
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2ea] sm:text-5xl">
              Recent users synced from Clerk into Prisma
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#dbe5df] sm:text-lg">
              New authenticated users are created in the local `User` table on
              first access, then the admin check runs against `User.role`.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {overview.recentUsers.length > 0 ? (
            overview.recentUsers.map((user) => {
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.email ||
                "Unnamed user";

              return (
                <article
                  key={user.id}
                  className="rounded-[24px] border border-white/[0.12] bg-white/[0.06] px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#f7f2ea]">
                        {fullName}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#dbe5df]">
                        {user.email ?? "No email on file"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f7f2ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#24362f]">
                        {user.role}
                      </span>
                      <span className="rounded-full border border-white/[0.16] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f7f2ea]">
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#dbe5df]">
                    Joined {formatDate(user.createdAt)}
                  </p>
                </article>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-white/[0.12] bg-white/[0.06] px-5 py-6 text-sm leading-7 text-[#dbe5df]">
              No synced users yet. After a user signs in with Clerk, they will
              appear here automatically.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
