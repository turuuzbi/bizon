import { NextResponse } from "next/server";

import { getCurrentAppUser, isClerkConfigured } from "@/lib/auth";

export async function GET() {
  if (!isClerkConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return NextResponse.json({ role: null });
  }

  return NextResponse.json({
    role: appUser.role,
  });
}
