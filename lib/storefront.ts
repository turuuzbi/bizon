import { prisma } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function getLandingPageData() {
  const [categories, brands, featuredProducts, collections] = await Promise.all(
    [
      prisma.category.findMany({
        where: {
          isActive: true,
          slug: {
            in: [
              "barilgiin-material",
              "bagaj-heregsel",
              "gar-bagaj",
              "fastener",
            ],
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
        },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        take: 8,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      }),
      prisma.product.findMany({
        where: {
          status: ProductStatus.ACTIVE,
          OR: [
            { isFeatured: true },
            { isNewArrival: true },
            {
              primaryCategory: {
                slug: {
                  in: ["bagaj-heregsel", "gar-bagaj", "fastener"],
                },
              },
            },
          ],
        },
        take: 8,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          brand: {
            select: { name: true, slug: true },
          },
          primaryCategory: {
            select: { name: true, slug: true },
          },
          images: {
            orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
            take: 1,
            select: { url: true, altText: true },
          },
          variants: {
            where: { isActive: true },
            orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
            take: 1,
            select: {
              id: true,
              title: true,
              price: true,
              compareAtPrice: true,
            },
          },
        },
      }),
      prisma.collection.findMany({
        where: { isActive: true },
        take: 4,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          description: true,
        },
      }),
    ],
  );

  return {
    categories,
    brands,
    featuredProducts,
    collections,
  };
}

export async function getProducts(params: {
  search?: string;
  category?: string;
  featured?: boolean;
  newArrival?: boolean;
}) {
  const { search, category, featured, newArrival } = params;

  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      ...(featured ? { isFeatured: true } : {}),
      ...(newArrival ? { isNewArrival: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category
        ? {
            OR: [
              { primaryCategory: { slug: category } },
              {
                productCategories: {
                  some: {
                    category: { slug: category },
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: [
      { isFeatured: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      brand: true,
      primaryCategory: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        take: 1,
      },
      variants: {
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
        take: 1,
      },
    },
  });
}
