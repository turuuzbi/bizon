import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/storefront";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";
    const newArrival = searchParams.get("newArrival") === "true";

    const products = await getProducts({
      search,
      category,
      featured,
      newArrival,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products failed", error);
    return NextResponse.json(
      { message: "Unable to load products" },
      { status: 500 },
    );
  }
}
