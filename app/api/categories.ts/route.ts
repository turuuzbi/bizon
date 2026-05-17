import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        parentId: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories failed", error);
    return NextResponse.json(
      { message: "Unable to load categories" },
      { status: 500 },
    );
  }
}
