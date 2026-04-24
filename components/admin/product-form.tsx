import { ProductStatus, UnitType } from "@prisma/client";

import {
  PRODUCT_STATUS_OPTIONS,
  UNIT_TYPE_OPTIONS,
} from "@/lib/admin-products";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { NoticeBanner } from "@/components/admin/notice-banner";

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  submitPendingLabel?: string;
  title: string;
  description: string;
  error?: string | null;
  message?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    shortDescription: string | null;
    description: string | null;
    status: ProductStatus;
    currency: string;
    baseUnit: UnitType;
    trackInventory: boolean;
    allowBackorder: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    seoTitle: string | null;
    seoDescription: string | null;
    publishedAt: Date | null;
    brandId: string | null;
    primaryCategoryId: string | null;
    productCategories: { categoryId: string }[];
  } | null;
  options: {
    brands: { id: string; name: string; isActive: boolean }[];
    categories: {
      id: string;
      name: string;
      label: string;
      parentId: string | null;
      isActive: boolean;
    }[];
  };
};

function formatDateTimeLocal(value: Date | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export function ProductForm({
  action,
  submitLabel,
  submitPendingLabel,
  title,
  description,
  error,
  message,
  product,
  options,
}: ProductFormProps) {
  const selectedCategoryIds = new Set(
    product?.productCategories.map((item) => item.categoryId) ?? [],
  );

  return (
    <div className="flex flex-col gap-6">
      {message ? <NoticeBanner kind="success" message={message} /> : null}
      {error ? <NoticeBanner kind="error" message={error} /> : null}

      <section className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
            Product editor
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      <form action={action} className="flex flex-col gap-6">
        <section className="rounded-[36px] border border-black/10 bg-[#fffcf8] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                Product name
              </span>
              <input
                name="name"
                required
                defaultValue={product?.name ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">Slug</span>
              <input
                name="slug"
                defaultValue={product?.slug ?? ""}
                placeholder="leave blank to generate from name"
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">SKU</span>
              <input
                name="sku"
                defaultValue={product?.sku ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                Currency
              </span>
              <input
                name="currency"
                defaultValue={product?.currency ?? "MNT"}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm uppercase text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">Status</span>
              <select
                name="status"
                defaultValue={product?.status ?? ProductStatus.DRAFT}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              >
                {PRODUCT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                Base unit
              </span>
              <select
                name="baseUnit"
                defaultValue={product?.baseUnit ?? UnitType.PIECE}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              >
                {UNIT_TYPE_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-[#1d1a17]">
              Short description
            </span>
            <textarea
              name="shortDescription"
              rows={3}
              defaultValue={product?.shortDescription ?? ""}
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm leading-7 text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
            />
          </label>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-[#1d1a17]">
              Full description
            </span>
            <textarea
              name="description"
              rows={8}
              defaultValue={product?.description ?? ""}
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm leading-7 text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
            />
          </label>
        </section>

        <section className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">Brand</span>
              <select
                name="brandId"
                defaultValue={product?.brandId ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              >
                <option value="">No brand selected</option>
                {options.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                    {brand.isActive ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                New brand name
              </span>
              <input
                name="newBrandName"
                placeholder="optional: create or match a brand by name"
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <label className="block lg:col-span-2">
              <span className="text-sm font-semibold text-[#1d1a17]">
                Primary category
              </span>
              <select
                name="primaryCategoryId"
                defaultValue={product?.primaryCategoryId ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              >
                <option value="">No primary category</option>
                {options.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                    {category.isActive ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6">
            <span className="text-sm font-semibold text-[#1d1a17]">
              Category selection
            </span>
            <div className="mt-3 grid max-h-[320px] gap-3 overflow-y-auto rounded-[24px] border border-black/10 bg-white p-4 md:grid-cols-2">
              {options.categories.length > 0 ? (
                options.categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-start gap-3 rounded-[16px] border border-black/[0.06] bg-[#fffcf8] px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={category.id}
                      defaultChecked={selectedCategoryIds.has(category.id)}
                      className="mt-1 h-4 w-4 rounded border-black/20 text-[#24362f] focus:ring-[#24362f]"
                    />
                    <span className="text-sm leading-6 text-[#3f3a35]">
                      {category.label}
                      {category.isActive ? "" : " (inactive)"}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-sm leading-7 text-[#625f5a]">
                  No categories exist yet. You can still create some below with
                  comma-separated names.
                </p>
              )}
            </div>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-semibold text-[#1d1a17]">
              New categories
            </span>
            <input
              name="newCategories"
              placeholder="e.g. Tile, Bathroom, Electrical"
              className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
            />
          </label>
        </section>

        <section className="rounded-[36px] border border-black/10 bg-[#f1ece4] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                Published at
              </span>
              <input
                type="datetime-local"
                name="publishedAt"
                defaultValue={formatDateTimeLocal(product?.publishedAt)}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  name: "trackInventory",
                  label: "Track inventory",
                  checked: product?.trackInventory ?? true,
                },
                {
                  name: "allowBackorder",
                  label: "Allow backorder",
                  checked: product?.allowBackorder ?? false,
                },
                {
                  name: "isFeatured",
                  label: "Featured product",
                  checked: product?.isFeatured ?? false,
                },
                {
                  name: "isNewArrival",
                  label: "New arrival",
                  checked: product?.isNewArrival ?? false,
                },
              ].map((item) => (
                <label
                  key={item.name}
                  className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm font-medium text-[#3f3a35]"
                >
                  <input
                    type="checkbox"
                    name={item.name}
                    defaultChecked={item.checked}
                    className="h-4 w-4 rounded border-black/20 text-[#24362f] focus:ring-[#24362f]"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                SEO title
              </span>
              <input
                name="seoTitle"
                defaultValue={product?.seoTitle ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#1d1a17]">
                SEO description
              </span>
              <textarea
                name="seoDescription"
                rows={3}
                defaultValue={product?.seoDescription ?? ""}
                className="mt-2 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm leading-7 text-[#1d1a17] outline-none transition-colors focus:border-[#24362f]"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <AdminSubmitButton
            label={submitLabel}
            pendingLabel={submitPendingLabel}
          />
        </div>
      </form>
    </div>
  );
}
