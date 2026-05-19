import { ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

function isAssistantMessage(value: unknown): value is AssistantMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;

  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

function extractOutputText(response: OpenAIResponse) {
  if (response.output_text?.trim()) {
    return response.output_text.trim();
  }

  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || "";
}

async function getCatalogContext() {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
    },
    orderBy: [
      { isFeatured: "desc" },
      { isNewArrival: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 30,
    select: {
      name: true,
      sku: true,
      shortDescription: true,
      description: true,
      baseUnit: true,
      brand: {
        select: {
          name: true,
        },
      },
      primaryCategory: {
        select: {
          name: true,
        },
      },
      variants: {
        where: {
          isActive: true,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
        take: 4,
        select: {
          title: true,
          sku: true,
          price: true,
          unitLabel: true,
          inventoryQuantity: true,
          allowBackorder: true,
        },
      },
      specifications: {
        orderBy: [{ isHighlighted: "desc" }, { position: "asc" }],
        take: 6,
        select: {
          name: true,
          value: true,
          unit: true,
        },
      },
    },
  });

  if (products.length === 0) {
    return "No active products are currently available in the catalog.";
  }

  return products
    .map((product, index) => {
      const variants = product.variants
        .map((variant) => {
          const stock = variant.allowBackorder
            ? "backorder allowed"
            : `${variant.inventoryQuantity} in stock`;

          return `${variant.title}${variant.sku ? ` (${variant.sku})` : ""}: ${variant.price.toString()} ${variant.unitLabel ?? product.baseUnit}, ${stock}`;
        })
        .join("; ");

      const specs = product.specifications
        .map((specification) =>
          `${specification.name}: ${specification.value}${specification.unit ? ` ${specification.unit}` : ""}`,
        )
        .join("; ");

      return [
        `${index + 1}. ${product.name}${product.sku ? ` (${product.sku})` : ""}`,
        product.brand ? `Brand: ${product.brand.name}` : null,
        product.primaryCategory ? `Category: ${product.primaryCategory.name}` : null,
        `Unit: ${product.baseUnit}`,
        product.shortDescription || product.description
          ? `Details: ${(product.shortDescription || product.description || "").slice(0, 220)}`
          : null,
        variants ? `Variants: ${variants}` : null,
        specs ? `Specs: ${specs}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing OPENAI_API_KEY. Add it to your environment to enable the assistant.",
      },
      { status: 503 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawMessages = (payload as { messages?: unknown }).messages;

  if (!Array.isArray(rawMessages)) {
    return Response.json({ error: "Messages are required." }, { status: 400 });
  }

  const messages = rawMessages
    .filter(isAssistantMessage)
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return Response.json(
      { error: "The latest message must be from the user." },
      { status: 400 },
    );
  }

  const catalogContext = await getCatalogContext();
  const model = process.env.OPENAI_MODEL || "gpt-5";

  const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: [
        "You are Erka's product ordering assistant for a building materials storefront.",
        "Help shoppers choose correct products from the provided catalog context.",
        "Ask concise clarifying questions when measurements, use case, surface, quantity, or compatibility details are missing.",
        "Recommend only products that appear in the catalog context. Do not invent SKUs, stock, prices, specs, or availability.",
        "When useful, include product names, variant names, quantities to verify, and short reasons.",
        "If the catalog does not contain a clear fit, say so and suggest what the customer should confirm with staff.",
        `Catalog context:\n${catalogContext}`,
      ].join("\n\n"),
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }),
  });

  const data = (await openAIResponse.json()) as OpenAIResponse;

  if (!openAIResponse.ok) {
    return Response.json(
      {
        error:
          data.error?.message ||
          "The assistant could not respond. Please try again.",
      },
      { status: openAIResponse.status },
    );
  }

  const reply = extractOutputText(data);

  return Response.json({
    message:
      reply ||
      "I could not find a clear answer yet. Could you share a little more detail?",
  });
}
