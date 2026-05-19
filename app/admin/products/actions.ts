"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  importProductsFromWorkbook,
  parseManualProductFormData,
  updateProduct,
} from "@/lib/admin-products";
import { requireAdminUser } from "@/lib/auth";
import { formatString, getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

function buildRedirectUrl(
  pathname: string,
  params: Record<string, string | null | undefined>,
) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

async function getErrorMessage(error: unknown) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return error instanceof Error ? error.message : t.admin.actions.somethingWrong;
}

export async function createProductAction(
  sourcePath: string,
  formData: FormData,
) {
  await requireAdminUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  try {
    const product = await createProduct(parseManualProductFormData(formData));

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.id}`);
    revalidatePath("/");
    revalidatePath("/products");

    redirect(
      buildRedirectUrl(`/admin/products/${product.id}`, {
        message: formatString(t.admin.actions.created, { name: product.name }),
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl(sourcePath, {
        error: await getErrorMessage(error),
      }),
    );
  }
}

export async function updateProductAction(
  productId: string,
  sourcePath: string,
  formData: FormData,
) {
  await requireAdminUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  try {
    const product = await updateProduct(
      productId,
      parseManualProductFormData(formData),
    );

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/");
    revalidatePath("/products");

    redirect(
      buildRedirectUrl(`/admin/products/${productId}`, {
        message: formatString(t.admin.actions.updated, { name: product.name }),
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl(sourcePath, {
        error: await getErrorMessage(error),
      }),
    );
  }
}

export async function deleteProductAction(productId: string) {
  await requireAdminUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  try {
    const product = await deleteProduct(productId);

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/");
    revalidatePath("/products");

    redirect(
      buildRedirectUrl("/admin/products", {
        message: formatString(t.admin.actions.deleted, { name: product.name }),
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl("/admin/products", {
        error: await getErrorMessage(error),
      }),
    );
  }
}

export async function importProductsAction(formData: FormData) {
  await requireAdminUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(
      buildRedirectUrl("/admin/products", {
        error: t.admin.actions.uploadFirst,
      }),
    );
  }

  try {
    const result = await importProductsFromWorkbook(await file.arrayBuffer());
    const message = formatString(t.admin.actions.importFinished, {
      created: result.created,
      updated: result.updated,
      skipped: result.skipped,
    });
    const errorSummary =
      result.errors.length > 0
        ? formatString(t.admin.actions.rowsFailed, {
            count: result.errors.length,
            first: result.errors[0],
          })
        : null;

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");

    redirect(
      buildRedirectUrl("/admin/products", {
        message,
        error: errorSummary,
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl("/admin/products", {
        error: await getErrorMessage(error),
      }),
    );
  }
}
