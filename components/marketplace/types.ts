export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  unitLabel: string;
  imageUrl: string | null;
  imageAlt: string | null;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  sku: string | null;
};

export type CartEntry = {
  product: ProductSummary;
  quantity: number;
};
