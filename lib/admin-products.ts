import {
  Prisma,
  ProductStatus,
  UnitType,
  type Category,
  type Product,
} from "@prisma/client";
import * as XLSX from "xlsx";

import { prisma } from "@/lib/prisma";

export const PRODUCT_STATUS_OPTIONS = Object.values(ProductStatus);
export const UNIT_TYPE_OPTIONS = Object.values(UnitType);

type ProductMutationInput = {
  name: string;
  slugInput?: string | null;
  sku?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  status?: ProductStatus;
  currency?: string | null;
  baseUnit?: UnitType;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: Date | null;
  brandId?: string | null;
  brandName?: string | null;
  selectedCategoryIds?: string[];
  categoryNames?: string[];
  primaryCategoryId?: string | null;
  primaryCategoryName?: string | null;
};

type ResolvedProductInput = {
  data: Prisma.ProductUncheckedCreateInput;
  categoryIds: string[];
};

type SpreadsheetImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

function cleanText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function splitList(value: string | null | undefined) {
  return (value ?? "")
    .split(/[,\n;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueValues(values: string[]) {
  return [...new Set(values)];
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

function parseBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "yes", "1", "on", "y"].includes(normalized)) {
      return true;
    }

    if (["false", "no", "0", "off", "n"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
}

function parseDateValue(value: unknown) {
  if (!value) {
    return null;
  }

  if (!(value instanceof Date) && typeof value !== "string") {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function isSlugTaken(
  model: "brand" | "category" | "product",
  slug: string,
  excludeId?: string,
) {
  if (model === "brand") {
    const record = await prisma.brand.findUnique({ where: { slug } });
    return Boolean(record && record.id !== excludeId);
  }

  if (model === "category") {
    const record = await prisma.category.findUnique({ where: { slug } });
    return Boolean(record && record.id !== excludeId);
  }

  const record = await prisma.product.findUnique({ where: { slug } });
  return Boolean(record && record.id !== excludeId);
}

async function ensureUniqueSlug(
  model: "brand" | "category" | "product",
  input: string,
  excludeId?: string,
) {
  const base = slugify(input) || "item";
  let candidate = base;
  let index = 2;

  while (await isSlugTaken(model, candidate, excludeId)) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  return candidate;
}

async function ensureBrand(brandId: string | null, brandName: string | null) {
  if (brandId) {
    const existing = await prisma.brand.findUnique({ where: { id: brandId } });

    if (!existing) {
      throw new Error("Selected brand could not be found.");
    }

    return existing;
  }

  if (!brandName) {
    return null;
  }

  const existing = await prisma.brand.findFirst({
    where: {
      name: {
        equals: brandName,
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.brand.create({
    data: {
      name: brandName,
      slug: await ensureUniqueSlug("brand", brandName),
    },
  });
}

async function ensureCategoryByName(name: string) {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          slug: slugify(name),
        },
      ],
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.category.create({
    data: {
      name,
      slug: await ensureUniqueSlug("category", name),
    },
  });
}

async function resolveCategories(input: {
  selectedCategoryIds: string[];
  categoryNames: string[];
  primaryCategoryId: string | null;
  primaryCategoryName: string | null;
}) {
  const selectedIds = uniqueValues(input.selectedCategoryIds);
  const existingCategories =
    selectedIds.length > 0
      ? await prisma.category.findMany({
          where: { id: { in: selectedIds } },
        })
      : [];

  if (existingCategories.length !== selectedIds.length) {
    throw new Error("One or more selected categories could not be found.");
  }

  const createdOrMatchedCategories: Category[] = [];

  for (const name of uniqueValues(input.categoryNames)) {
    createdOrMatchedCategories.push(await ensureCategoryByName(name));
  }

  let primaryCategory: Category | null = null;

  if (input.primaryCategoryId) {
    primaryCategory = await prisma.category.findUnique({
      where: { id: input.primaryCategoryId },
    });

    if (!primaryCategory) {
      throw new Error("Selected primary category could not be found.");
    }
  } else if (input.primaryCategoryName) {
    primaryCategory = await ensureCategoryByName(input.primaryCategoryName);
  }

  const categoryIds = uniqueValues([
    ...existingCategories.map((category) => category.id),
    ...createdOrMatchedCategories.map((category) => category.id),
    ...(primaryCategory ? [primaryCategory.id] : []),
  ]);

  return {
    categoryIds,
    primaryCategoryId:
      primaryCategory?.id ?? (categoryIds.length === 1 ? categoryIds[0] : null),
  };
}

async function resolveProductInput(
  input: ProductMutationInput,
  options?: {
    productId?: string;
    currentPublishedAt?: Date | null;
  },
): Promise<ResolvedProductInput> {
  const name = cleanText(input.name);

  if (!name) {
    throw new Error("Product name is required.");
  }

  const brand = await ensureBrand(
    cleanText(input.brandId),
    cleanText(input.brandName),
  );
  const categories = await resolveCategories({
    selectedCategoryIds: input.selectedCategoryIds ?? [],
    categoryNames: uniqueValues(
      (input.categoryNames ?? []).map((value) => value.trim()).filter(Boolean),
    ),
    primaryCategoryId: cleanText(input.primaryCategoryId),
    primaryCategoryName: cleanText(input.primaryCategoryName),
  });

  const status = input.status ?? ProductStatus.DRAFT;
  const baseUnit = input.baseUnit ?? UnitType.PIECE;
  const currency = cleanText(input.currency)?.toUpperCase() ?? "MNT";
  const providedPublishedAt = input.publishedAt ?? null;
  const shouldStampPublishedAt =
    status === ProductStatus.ACTIVE &&
    !providedPublishedAt &&
    !options?.currentPublishedAt;

  return {
    data: {
      name,
      slug: await ensureUniqueSlug(
        "product",
        cleanText(input.slugInput) ?? name,
        options?.productId,
      ),
      sku: cleanText(input.sku),
      shortDescription: cleanText(input.shortDescription),
      description: cleanText(input.description),
      status,
      brandId: brand?.id ?? null,
      primaryCategoryId: categories.primaryCategoryId,
      currency,
      baseUnit,
      trackInventory: input.trackInventory ?? true,
      allowBackorder: input.allowBackorder ?? false,
      isFeatured: input.isFeatured ?? false,
      isNewArrival: input.isNewArrival ?? false,
      seoTitle: cleanText(input.seoTitle),
      seoDescription: cleanText(input.seoDescription),
      publishedAt:
        providedPublishedAt ??
        (shouldStampPublishedAt ? new Date() : options?.currentPublishedAt ?? null),
    },
    categoryIds: categories.categoryIds,
  };
}

export function parseManualProductFormData(formData: FormData): ProductMutationInput {
  const statusValue = cleanText(formData.get("status")?.toString());
  const baseUnitValue = cleanText(formData.get("baseUnit")?.toString());

  return {
    name: formData.get("name")?.toString() ?? "",
    slugInput: formData.get("slug")?.toString() ?? "",
    sku: formData.get("sku")?.toString() ?? "",
    shortDescription: formData.get("shortDescription")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    status: PRODUCT_STATUS_OPTIONS.includes(statusValue as ProductStatus)
      ? (statusValue as ProductStatus)
      : ProductStatus.DRAFT,
    currency: formData.get("currency")?.toString() ?? "MNT",
    baseUnit: UNIT_TYPE_OPTIONS.includes(baseUnitValue as UnitType)
      ? (baseUnitValue as UnitType)
      : UnitType.PIECE,
    trackInventory: parseBoolean(formData.get("trackInventory")),
    allowBackorder: parseBoolean(formData.get("allowBackorder")),
    isFeatured: parseBoolean(formData.get("isFeatured")),
    isNewArrival: parseBoolean(formData.get("isNewArrival")),
    seoTitle: formData.get("seoTitle")?.toString() ?? "",
    seoDescription: formData.get("seoDescription")?.toString() ?? "",
    publishedAt: parseDateValue(formData.get("publishedAt")?.toString()),
    brandId: formData.get("brandId")?.toString() ?? "",
    brandName: formData.get("newBrandName")?.toString() ?? "",
    selectedCategoryIds: formData
      .getAll("categoryIds")
      .map((value) => value.toString())
      .filter(Boolean),
    categoryNames: splitList(formData.get("newCategories")?.toString()),
    primaryCategoryId: formData.get("primaryCategoryId")?.toString() ?? "",
    primaryCategoryName: "",
  };
}

function getRowValue(row: Record<string, unknown>, aliases: string[]) {
  const normalizedAliases = aliases.map(normalizeHeader);

  for (const [key, value] of Object.entries(row)) {
    if (normalizedAliases.includes(normalizeHeader(key))) {
      return value;
    }
  }

  return undefined;
}

function rowHasContent(row: Record<string, unknown>) {
  return Object.values(row).some((value) => cleanText(String(value ?? "")));
}

function parseSpreadsheetRow(row: Record<string, unknown>): ProductMutationInput {
  const statusValue = cleanText(
    getRowValue(row, ["status"])?.toString() ?? ProductStatus.DRAFT,
  );
  const baseUnitValue = cleanText(
    getRowValue(row, ["baseUnit", "unit", "base_unit"])?.toString() ??
      UnitType.PIECE,
  );

  return {
    name: getRowValue(row, ["name", "productName", "product_name"])?.toString() ?? "",
    slugInput: getRowValue(row, ["slug"])?.toString() ?? "",
    sku: getRowValue(row, ["sku"])?.toString() ?? "",
    shortDescription:
      getRowValue(row, ["shortDescription", "short_description"])?.toString() ?? "",
    description:
      getRowValue(row, ["description", "details"])?.toString() ?? "",
    status: PRODUCT_STATUS_OPTIONS.includes(statusValue as ProductStatus)
      ? (statusValue as ProductStatus)
      : ProductStatus.DRAFT,
    currency: getRowValue(row, ["currency"])?.toString() ?? "MNT",
    baseUnit: UNIT_TYPE_OPTIONS.includes(baseUnitValue as UnitType)
      ? (baseUnitValue as UnitType)
      : UnitType.PIECE,
    trackInventory: parseBoolean(
      getRowValue(row, ["trackInventory", "track_inventory"]),
      true,
    ),
    allowBackorder: parseBoolean(
      getRowValue(row, ["allowBackorder", "allow_backorder"]),
      false,
    ),
    isFeatured: parseBoolean(
      getRowValue(row, ["isFeatured", "featured", "is_featured"]),
      false,
    ),
    isNewArrival: parseBoolean(
      getRowValue(row, ["isNewArrival", "newArrival", "is_new_arrival"]),
      false,
    ),
    seoTitle: getRowValue(row, ["seoTitle", "seo_title"])?.toString() ?? "",
    seoDescription:
      getRowValue(row, ["seoDescription", "seo_description"])?.toString() ?? "",
    publishedAt: parseDateValue(
      getRowValue(row, ["publishedAt", "published_at", "publishDate"]),
    ),
    brandName: getRowValue(row, ["brand", "brandName", "brand_name"])?.toString() ?? "",
    categoryNames: splitList(
      getRowValue(row, ["categories", "categoryList", "category_list"])?.toString(),
    ),
    primaryCategoryName:
      getRowValue(row, [
        "primaryCategory",
        "primary_category",
        "mainCategory",
        "main_category",
      ])?.toString() ?? "",
  };
}

export async function createProduct(input: ProductMutationInput) {
  const resolved = await resolveProductInput(input);

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: resolved.data,
    });

    if (resolved.categoryIds.length > 0) {
      await tx.productCategory.createMany({
        data: resolved.categoryIds.map((categoryId, index) => ({
          productId: product.id,
          categoryId,
          sortOrder: index,
        })),
        skipDuplicates: true,
      });
    }

    return product;
  });
}

export async function updateProduct(productId: string, input: ProductMutationInput) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      publishedAt: true,
    },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  const resolved = await resolveProductInput(input, {
    productId,
    currentPublishedAt: existing.publishedAt,
  });

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id: productId },
      data: resolved.data,
    });

    await tx.productCategory.deleteMany({
      where: { productId },
    });

    if (resolved.categoryIds.length > 0) {
      await tx.productCategory.createMany({
        data: resolved.categoryIds.map((categoryId, index) => ({
          productId,
          categoryId,
          sortOrder: index,
        })),
        skipDuplicates: true,
      });
    }

    return product;
  });
}

export async function deleteProduct(productId: string) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
    },
  });

  if (!existing) {
    throw new Error("Product not found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({
      where: { productId },
    });

    await tx.product.delete({
      where: { id: productId },
    });
  });

  return existing;
}

async function upsertProductFromImport(input: ProductMutationInput) {
  const sku = cleanText(input.sku);
  const slug = cleanText(input.slugInput);

  let existing: Pick<Product, "id" | "publishedAt"> | null = null;

  if (sku) {
    existing = await prisma.product.findFirst({
      where: { sku },
      select: { id: true, publishedAt: true },
    });
  }

  if (!existing && slug) {
    existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, publishedAt: true },
    });
  }

  if (existing) {
    await updateProduct(existing.id, input);
    return "updated" as const;
  }

  await createProduct(input);
  return "created" as const;
}

export async function importProductsFromWorkbook(
  fileBuffer: ArrayBuffer,
): Promise<SpreadsheetImportResult> {
  const workbook = XLSX.read(Buffer.from(fileBuffer), {
    type: "buffer",
    cellDates: true,
  });
  const sheetName = workbook.SheetNames.includes("Products")
    ? "Products"
    : workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("The uploaded workbook does not contain any sheets.");
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;

    if (!rowHasContent(row)) {
      skipped += 1;
      continue;
    }

    try {
      const parsed = parseSpreadsheetRow(row);

      if (!cleanText(parsed.name)) {
        skipped += 1;
        continue;
      }

      const result = await upsertProductFromImport(parsed);

      if (result === "created") {
        created += 1;
      } else {
        updated += 1;
      }
    } catch (error) {
      errors.push(
        `Row ${rowNumber}: ${
          error instanceof Error ? error.message : "Unknown import error."
        }`,
      );
    }
  }

  return {
    created,
    updated,
    skipped,
    errors,
  };
}

export function formatCategoryLabel(
  category: Pick<Category, "id" | "name" | "parentId">,
  categoryMap: Map<string, Pick<Category, "id" | "name" | "parentId">>,
) {
  const parts = [category.name];
  let pointer = category.parentId ? categoryMap.get(category.parentId) : null;

  while (pointer) {
    parts.unshift(pointer.name);
    pointer = pointer.parentId ? categoryMap.get(pointer.parentId) : null;
  }

  return parts.join(" / ");
}

export async function getProductFormOptions() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        parentId: true,
        isActive: true,
      },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    }),
  ]);

  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return {
    categories: categories.map((category) => ({
      ...category,
      label: formatCategoryLabel(category, categoryMap),
    })),
    brands,
  };
}

export async function getEditableProduct(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      brand: {
        select: {
          id: true,
          name: true,
        },
      },
      primaryCategory: {
        select: {
          id: true,
          name: true,
        },
      },
      productCategories: {
        select: {
          categoryId: true,
        },
      },
    },
  });
}
