import Link from "next/link";

import { ProductCard } from "@/components/marketplace/product-card";
import type { ProductSummary } from "@/components/marketplace/types";

type ProductRailProps = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  products: ProductSummary[];
};

export function ProductRail({
  title,
  viewAllHref,
  viewAllLabel,
  products,
}: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-[#18181b] sm:text-2xl">
          {title}
        </h2>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-medium text-[#8e55cf] hover:text-[#7d45c1]"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {products.map((product) => (
          <div key={product.id} className="w-[200px] shrink-0 sm:w-[230px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
