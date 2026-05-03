import { UserRole } from "@prisma/client";

import { getCurrentAppUser, isClerkConfigured } from "@/lib/auth";

const template = `name,sku,slug,status,brand,primaryCategory,categories,shortDescription,description,currency,baseUnit,trackInventory,allowBackorder,isFeatured,isNewArrival,seoTitle,seoDescription,publishedAt,images
Sample Wall Paint,PAINT-001,sample-wall-paint,ACTIVE,Erkas Paints,Paint,Paint|Interior,Soft matte interior paint,Low sheen paint for interior walls,MNT,PIECE,true,false,true,true,Sample Wall Paint,Premium interior wall paint,2026-04-24T10:00,https://example.com/sample-wall-paint.jpg | Sample wall paint
`;

export async function GET() {
  if (!isClerkConfigured()) {
    return new Response("Clerk is not configured.", { status: 503 });
  }

  const appUser = await getCurrentAppUser();

  if (!appUser || appUser.role !== UserRole.ADMIN) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(template, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="erkas-products-template.csv"',
      "Cache-Control": "no-store",
    },
  });
}
