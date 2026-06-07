"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { placeOrder } from "@/lib/orders";

export async function placeOrderAction(formData: FormData) {
  const get = (key: string) => formData.get(key)?.toString() ?? "";

  const result = await placeOrder({
    recipientName: get("recipientName"),
    phone: get("phone"),
    city: get("city"),
    district: get("district"),
    line1: get("line1"),
    line2: get("line2"),
    note: get("note"),
  });

  if (!result.ok) {
    if (result.reason === "unauthenticated") redirect("/sign-in");
    if (result.reason === "empty") redirect("/cart");
    redirect("/checkout?error=1");
  }

  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect(`/checkout/success?order=${result.orderNumber}`);
}
