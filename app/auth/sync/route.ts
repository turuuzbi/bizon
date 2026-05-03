import { NextRequest, NextResponse } from "next/server";

import { getCurrentAppUser, isClerkConfigured } from "@/lib/auth";

function getSafeRedirectPath(request: NextRequest) {
  const redirectPath = request.nextUrl.searchParams.get("redirect_url");

  if (!redirectPath || !redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
    return "/";
  }

  return redirectPath;
}

export async function GET(request: NextRequest) {
  const redirectPath = getSafeRedirectPath(request);
  const destination = new URL(redirectPath, request.url);

  if (!isClerkConfigured()) {
    return NextResponse.redirect(destination);
  }

  await getCurrentAppUser();

  return NextResponse.redirect(destination);
}
