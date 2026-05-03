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

function buildRedirectUrl(
  pathname: string,
  params: Record<string, string | null | undefined>,
) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createProductAction(
  sourcePath: string,
  formData: FormData,
) {
  await requireAdminUser();

  try {
    const product = await createProduct(parseManualProductFormData(formData));

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.id}`);
    revalidatePath("/");
    revalidatePath("/products");

    redirect(
      buildRedirectUrl(`/admin/products/${product.id}`, {
        message: `Created ${product.name}.`,
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl(sourcePath, {
        error: getErrorMessage(error),
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
        message: `Updated ${product.name}.`,
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl(sourcePath, {
        error: getErrorMessage(error),
      }),
    );
  }
}

export async function deleteProductAction(productId: string) {
  await requireAdminUser();

  try {
    const product = await deleteProduct(productId);

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/");
    revalidatePath("/products");

    redirect(
      buildRedirectUrl("/admin/products", {
        message: `Deleted ${product.name}.`,
      }),
    );
  } catch (error) {
    redirect(
      buildRedirectUrl("/admin/products", {
        error: getErrorMessage(error),
      }),
    );
  }
}

export async function importProductsAction(formData: FormData) {
  await requireAdminUser();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(
      buildRedirectUrl("/admin/products", {
        error: "Upload an Excel or CSV file first.",
      }),
    );
  }

  try {
    const result = await importProductsFromWorkbook(await file.arrayBuffer());
    const message = `Import finished: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`;
    const errorSummary =
      result.errors.length > 0
        ? `${result.errors.length} row(s) failed. ${result.errors[0]}`
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
        error: getErrorMessage(error),
      }),
    );
  }
}
