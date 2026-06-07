"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addToCart,
  removeCartItem,
  setCartItemQuantity,
  type CartActionResult,
} from "@/lib/cart";

function revalidateCart() {
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function addToCartAction(
  productId: string,
  variantId: string | null,
  quantity: number,
): Promise<CartActionResult> {
  const result = await addToCart(productId, variantId, quantity);
  if (!result.ok && result.reason === "unauthenticated") {
    redirect("/sign-in");
  }
  revalidateCart();
  return result;
}

export async function buyNowAction(
  productId: string,
  variantId: string | null,
  quantity: number,
): Promise<CartActionResult> {
  const result = await addToCart(productId, variantId, quantity);
  if (!result.ok && result.reason === "unauthenticated") {
    redirect("/sign-in");
  }
  if (result.ok) {
    revalidateCart();
    redirect("/checkout");
  }
  return result;
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  await setCartItemQuantity(itemId, quantity);
  revalidateCart();
}

export async function removeCartItemAction(itemId: string) {
  await removeCartItem(itemId);
  revalidateCart();
}
