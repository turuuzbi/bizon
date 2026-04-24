import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/app/admin/products/actions";
import { getProductFormOptions } from "@/lib/admin-products";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}) {
  const params = await searchParams;
  const options = await getProductFormOptions();

  return (
    <main className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/products"
          className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#24362f] hover:text-[#24362f]"
        >
          Back to products
        </Link>
      </div>

      <ProductForm
        action={createProductAction.bind(null, "/admin/products/new")}
        submitLabel="Create Product"
        submitPendingLabel="Creating..."
        title="Add a new product"
        description="Create the core product record first. Variants, specifications, and imagery can grow from this base cleanly."
        error={params.error}
        message={params.message}
        options={options}
        product={null}
      />
    </main>
  );
}
