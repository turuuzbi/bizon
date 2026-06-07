import {
  FulfillmentStatus,
  OrderAddressType,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { getCurrentAppUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type PlaceOrderInput = {
  recipientName: string;
  phone: string;
  city: string;
  district: string;
  line1: string;
  line2: string;
  note: string;
};

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; reason: "unauthenticated" | "empty" | "invalid" | "error" };

const toNumber = (value: Prisma.Decimal | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function generateOrderNumber() {
  const now = new Date();
  const ymd =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${String(now.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ER-${ymd}-${suffix}`;
}

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const user = await getCurrentAppUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const recipientName = input.recipientName.trim();
  const city = input.city.trim();
  const line1 = input.line1.trim();
  if (!recipientName || !city || !line1) {
    return { ok: false, reason: "invalid" };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          product: {
            select: {
              name: true,
              currency: true,
              baseUnit: true,
              images: {
                orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
                take: 1,
                select: { url: true },
              },
            },
          },
          variant: {
            select: {
              title: true,
              sku: true,
              price: true,
              unitLabel: true,
              isActive: true,
              trackInventory: true,
              inventoryQuantity: true,
            },
          },
        },
      },
    },
  });

  const items = (cart?.items ?? []).filter(
    (item) => !item.variant || item.variant.isActive,
  );
  if (!cart || items.length === 0) return { ok: false, reason: "empty" };

  const currency = cart.currency || "MNT";
  let subtotal = 0;
  const orderItemsData = items.map((item) => {
    const unitPrice = toNumber(item.unitPrice);
    const quantity = toNumber(item.quantity);
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;
    return {
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      variantTitle:
        item.variant && item.variant.title !== "Default"
          ? item.variant.title
          : null,
      sku: item.variant?.sku ?? null,
      unitLabel: item.variant?.unitLabel ?? null,
      quantity,
      unitPrice,
      lineTotal,
      imageUrl: item.product.images[0]?.url ?? null,
    };
  });

  try {
    const orderNumber = generateOrderNumber();
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
          currency,
          subtotalAmount: subtotal,
          totalAmount: subtotal,
          customerNote: input.note.trim() || null,
          placedAt: new Date(),
        },
      });

      await tx.orderItem.createMany({
        data: orderItemsData.map((line) => ({ orderId: order.id, ...line })),
      });

      await tx.orderAddress.create({
        data: {
          orderId: order.id,
          type: OrderAddressType.SHIPPING,
          recipientName,
          phone: input.phone.trim() || null,
          city,
          district: input.district.trim() || null,
          line1,
          line2: input.line2.trim() || null,
        },
      });

      // Decrement tracked inventory; clamp at zero.
      for (const item of items) {
        if (item.variantId && item.variant?.trackInventory) {
          const next = Math.max(
            0,
            item.variant.inventoryQuantity - toNumber(item.quantity),
          );
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { inventoryQuantity: next },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });

    return { ok: true, orderNumber };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export type OrderSummary = Awaited<ReturnType<typeof getUserOrders>>[number];

export async function getUserOrders() {
  const user = await getCurrentAppUser();
  if (!user) return [];

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      currency: true,
      totalAmount: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          productName: true,
          variantTitle: true,
          quantity: true,
          unitPrice: true,
          lineTotal: true,
          imageUrl: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    currency: order.currency,
    total: toNumber(order.totalAmount),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      variantTitle: item.variantTitle,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      lineTotal: toNumber(item.lineTotal),
      imageUrl: item.imageUrl,
    })),
  }));
}

export async function isSignedIn() {
  return Boolean(await getCurrentAppUser());
}
