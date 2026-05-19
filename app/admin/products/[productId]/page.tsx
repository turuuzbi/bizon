import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { ProductForm } from "@/components/admin/product-form";
import {
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/products/actions";
import { getEditableProduct, getProductFormOptions } from "@/lib/admin-products";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const tForm = t.admin.productForm;
  const [{ productId }, query] = await Promise.all([params, searchParams]);
  const [product, options] = await Promise.all([
    getEditableProduct(productId),
    getProductFormOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
          >
            {tForm.backToProducts}
          </Link>
        </div>

        <DeleteProductButton
          action={deleteProductAction.bind(null, product.id)}
          productName={product.name}
        />
      </div>

      <ProductForm
        action={updateProductAction.bind(null, product.id, `/admin/products/${product.id}`)}
        submitLabel={tForm.saveChanges}
        submitPendingLabel={tForm.saving}
        title={product.name}
        description={tForm.editPageCopy}
        error={query.error}
        message={query.message}
        options={options}
        product={product}
      />
    </main>
  );
}
