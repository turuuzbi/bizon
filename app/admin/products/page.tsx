import Link from "next/link";
import { Prisma, ProductStatus } from "@prisma/client";

import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { NoticeBanner } from "@/components/admin/notice-banner";
import {
  deleteProductAction,
  importProductsAction,
} from "@/app/admin/products/actions";
import { getDictionary, type Locale } from "@/lib/i18n";
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

function getStatusStyles(status: ProductStatus) {
  switch (status) {
    case ProductStatus.ACTIVE:
      return "bg-[#efe4fb] text-[#6d36ad]";
    case ProductStatus.ARCHIVED:
      return "bg-[#ede8e2] text-[#655f58]";
    default:
      return "bg-[#f7efe1] text-[#7b5f3d]";
  }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    message?: string;
    error?: string;
  }>;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const tOps = t.admin.productOps;

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const statusFilter = Object.values(ProductStatus).includes(
    params.status as ProductStatus,
  )
    ? (params.status as ProductStatus)
    : null;

  const where: Prisma.ProductWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [summary, products] = await Promise.all([
    Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
      prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
      prisma.product.count({ where: { status: ProductStatus.ARCHIVED } }),
    ]),
    prisma.product.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      take: 100,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        status: true,
        currency: true,
        baseUnit: true,
        updatedAt: true,
        publishedAt: true,
        isFeatured: true,
        isNewArrival: true,
        brand: { select: { name: true } },
        primaryCategory: { select: { name: true } },
        _count: { select: { variants: true, productCategories: true } },
      },
    }),
  ]);

  const [totalProducts, activeProducts, draftProducts, archivedProducts] =
    summary;

  return (
    <main className="flex flex-col gap-6">
      {params.message ? (
        <NoticeBanner kind="success" message={params.message} />
      ) : null}
      {params.error ? <NoticeBanner kind="error" message={params.error} /> : null}

      <section className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
              {tOps.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17] sm:text-5xl">
              {tOps.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
              {tOps.copy}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="rounded-full bg-[#8e55cf] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1]"
            >
              {tOps.addProduct}
            </Link>
            <Link
              href="/admin/products/template"
              className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
            >
              {tOps.downloadTemplate}
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: tOps.allProducts, value: totalProducts },
            { label: tOps.active, value: activeProducts },
            { label: tOps.draft, value: draftProducts },
            { label: tOps.archived, value: archivedProducts },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[28px] border border-black/[0.08] bg-[#f6f1ea] p-5"
            >
              <p className="text-sm font-medium text-[#625f5a]">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
                {card.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[36px] border border-black/10 bg-[#fffcf8] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
          <form className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="block flex-1">
              <span className="text-sm font-semibold text-[#1d1a17]">
                {tOps.searchProducts}
              </span>
              <input
                name="q"
                defaultValue={query}
                placeholder={tOps.searchPlaceholder}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#8e55cf]"
              />
            </label>

            <label className="block w-full lg:w-[220px]">
              <span className="text-sm font-semibold text-[#1d1a17]">
                {tOps.statusFilter}
              </span>
              <select
                name="status"
                defaultValue={statusFilter ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#8e55cf]"
              >
                <option value="">{tOps.allStatuses}</option>
                {Object.values(ProductStatus).map((status) => (
                  <option key={status} value={status}>
                    {t.productStatus[status]}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-full border border-black/10 px-6 py-3.5 text-sm font-semibold text-[#2d2a27] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
            >
              {tOps.filter}
            </button>
          </form>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-black/10 bg-white">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/8">
                  <thead className="bg-[#f6f1ea] text-left">
                    <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-[#625f5a]">
                      <th className="px-5 py-4">{tOps.productCol}</th>
                      <th className="px-5 py-4">{tOps.organizationCol}</th>
                      <th className="px-5 py-4">{tOps.statusCol}</th>
                      <th className="px-5 py-4">{tOps.metadataCol}</th>
                      <th className="px-5 py-4 text-right">{tOps.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/6">
                    {products.map((product) => (
                      <tr key={product.id} className="align-top">
                        <td className="px-5 py-5">
                          <div className="min-w-[220px]">
                            <p className="text-base font-semibold text-[#1d1a17]">
                              {product.name}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-[#625f5a]">
                              {product.slug}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-[#625f5a]">
                              {t.admin.overview.sku}:{" "}
                              {product.sku ?? t.admin.overview.notSet}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="min-w-[180px] text-sm leading-7 text-[#625f5a]">
                            <p>
                              {tOps.brand}: {product.brand?.name ?? tOps.noBrand}
                            </p>
                            <p>
                              {tOps.primaryCategory}:{" "}
                              {product.primaryCategory?.name ?? tOps.none}
                            </p>
                            <p>
                              {tOps.categoryLinks}: {product._count.productCategories}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex min-w-[160px] flex-wrap gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusStyles(
                                product.status,
                              )}`}
                            >
                              {t.productStatus[product.status]}
                            </span>
                            {product.isFeatured ? (
                              <span className="rounded-full bg-[#efe4d3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5f3d]">
                                {tOps.featured}
                              </span>
                            ) : null}
                            {product.isNewArrival ? (
                              <span className="rounded-full bg-[#e7eef4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#38586f]">
                                {tOps.newBadge}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="min-w-[180px] text-sm leading-7 text-[#625f5a]">
                            <p>
                              {product.currency} /{" "}
                              {t.unit[product.baseUnit] ?? product.baseUnit}
                            </p>
                            <p>
                              {tOps.variants}: {product._count.variants}
                            </p>
                            <p>
                              {tOps.published}:{" "}
                              {formatDate(
                                product.publishedAt,
                                locale,
                                tOps.notPublished,
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex min-w-[220px] flex-wrap justify-end gap-3">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
                            >
                              {tOps.edit}
                            </Link>
                            <DeleteProductButton
                              action={deleteProductAction.bind(null, product.id)}
                              productName={product.name}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-sm leading-7 text-[#625f5a]">
                {tOps.noMatch}
              </div>
            )}
          </div>
        </div>

        <section className="rounded-[36px] border border-black/10 bg-[#f1ece4] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
            {tOps.spreadsheetImport}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#1d1a17]">
            {tOps.importTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-[#625f5a]">
            {tOps.importCopy}
          </p>

          <form
            action={importProductsAction}
            encType="multipart/form-data"
            className="mt-8 flex flex-col gap-4"
          >
            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                {tOps.workbookFile}
              </span>
              <input
                type="file"
                name="file"
                accept=".xlsx,.xls,.csv"
                required
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] file:mr-4 file:rounded-full file:border-0 file:bg-[#8e55cf] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <div className="rounded-[24px] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-[#4f4a43]">
              <p>{tOps.howItWorks}</p>
              <p>{tOps.importHint1}</p>
              <p>{tOps.importHint2}</p>
              <p>{tOps.importHint3}</p>
              <p>{tOps.importHint4}</p>
              <p className="mt-4">{tOps.supportedColumns}</p>
              <p>{tOps.supportedColumnsList}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <AdminSubmitButton
                label={tOps.importSheet}
                pendingLabel={tOps.importing}
              />
              <Link
                href="/admin/products/template"
                className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
              >
                {tOps.downloadTemplateBtn}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
