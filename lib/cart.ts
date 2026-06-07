import { Prisma } from "@prisma/client";

import { getCurrentAppUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type CartLine = {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  variantTitle: string | null;
  slug: string;
  image: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  /** Max purchasable for this line (null => unlimited / untracked). */
  maxQuantity: number | null;
  currency: string;
};

export type CartView = {
  signedIn: boolean;
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  currency: string;
};

const toNumber = (value: Prisma.Decimal | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

/**
 * Resolve a purchasable variant for a product. If no variantId is given, fall
 * back to the product's default (or first active) variant — matching how the
 * PDP picks a variant.
 */
async function resolveVariant(productId: string, variantId: string | null) {
  if (variantId) {
    return prisma.productVariant.findFirst({
      where: { id: variantId, productId, isActive: true },
    });
  }
  return prisma.productVariant.findFirst({
    where: { productId, isActive: true },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

function availableStock(variant: {
  trackInventory: boolean;
  allowBackorder: boolean;
  inventoryQuantity: number;
}): number | null {
  if (!variant.trackInventory || variant.allowBackorder) return null;
  return Math.max(0, variant.inventoryQuantity);
}

export type CartActionResult =
  | { ok: true }
  | { ok: false; reason: "unauthenticated" | "unavailable" | "out_of_stock" };

export async function addToCart(
  productId: string,
  variantId: string | null,
  quantity: number,
): Promise<CartActionResult> {
  const user = await getCurrentAppUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const qty = Math.max(1, Math.trunc(quantity) || 1);
  const variant = await resolveVariant(productId, variantId);
  if (!variant) return { ok: false, reason: "unavailable" };

  const cart = await getOrCreateCart(user.id);
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variant.id },
  });

  const currentQty = existingItem ? toNumber(existingItem.quantity) : 0;
  const stock = availableStock(variant);
  let nextQty = currentQty + qty;
  if (stock !== null) {
    if (stock <= 0) return { ok: false, reason: "out_of_stock" };
    nextQty = Math.min(nextQty, stock);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: nextQty, unitPrice: variant.price },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variant.id,
        quantity: nextQty,
        unitPrice: variant.price,
      },
    });
  }

  return { ok: true };
}

export async function setCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<CartActionResult> {
  const user = await getCurrentAppUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId: user.id } },
    include: { variant: true },
  });
  if (!item) return { ok: false, reason: "unavailable" };

  const qty = Math.trunc(quantity) || 0;
  if (qty <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return { ok: true };
  }

  let nextQty = qty;
  if (item.variant) {
    const stock = availableStock(item.variant);
    if (stock !== null) nextQty = Math.min(nextQty, Math.max(1, stock));
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: nextQty },
  });
  return { ok: true };
}

export async function removeCartItem(itemId: string): Promise<CartActionResult> {
  const user = await getCurrentAppUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  await prisma.cartItem.deleteMany({
    where: { id: itemId, cart: { userId: user.id } },
  });
  return { ok: true };
}

export async function getCartView(): Promise<CartView> {
  const user = await getCurrentAppUser();
  if (!user) {
    return { signedIn: false, items: [], itemCount: 0, subtotal: 0, currency: "MNT" };
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
              slug: true,
              currency: true,
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
              price: true,
              trackInventory: true,
              allowBackorder: true,
              inventoryQuantity: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      signedIn: true,
      items: [],
      itemCount: 0,
      subtotal: 0,
      currency: "MNT",
    };
  }

  const items: CartLine[] = cart.items
    // Drop lines whose variant was deleted/deactivated since they were added.
    .filter((item) => !item.variant || item.variant.isActive)
    .map((item) => {
      const unitPrice = toNumber(item.unitPrice);
      const quantity = toNumber(item.quantity);
      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.product.name,
        variantTitle:
          item.variant && item.variant.title !== "Default"
            ? item.variant.title
            : null,
        slug: item.product.slug,
        image: item.product.images[0]?.url ?? null,
        unitPrice,
        quantity,
        lineTotal: unitPrice * quantity,
        maxQuantity: item.variant ? availableStock(item.variant) : null,
        currency: item.product.currency || cart.currency,
      };
    });

  const subtotal = items.reduce((sum, line) => sum + line.lineTotal, 0);
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  return {
    signedIn: true,
    items,
    itemCount,
    subtotal,
    currency: cart.currency || "MNT",
  };
}

export async function getCartCount(): Promise<number> {
  const user = await getCurrentAppUser();
  if (!user) return 0;
  const result = await prisma.cartItem.aggregate({
    where: {
      cart: { userId: user.id },
      OR: [{ variantId: null }, { variant: { isActive: true } }],
    },
    _sum: { quantity: true },
  });
  return Math.round(toNumber(result._sum.quantity));
}
