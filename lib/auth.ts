import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole, type User } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function parseCsv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? null;
}

function getAdminBootstrapConfig() {
  return {
    adminEmails: new Set(
      parseCsv(process.env.ADMIN_EMAILS).map((email) => email.toLowerCase()),
    ),
    adminClerkUserIds: new Set(parseCsv(process.env.ADMIN_CLERK_USER_IDS)),
  };
}

function shouldBootstrapAdmin(clerkUserId: string, email: string | null) {
  const { adminClerkUserIds, adminEmails } = getAdminBootstrapConfig();

  if (adminClerkUserIds.has(clerkUserId)) {
    return true;
  }

  return email ? adminEmails.has(email) : false;
}

export function isClerkConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );
}

export async function getCurrentAppUser(): Promise<User | null> {
  if (!isClerkConfigured()) {
    return null;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (existingUser) {
    const existingEmail = normalizeEmail(existingUser.email);

    if (
      existingUser.role !== UserRole.ADMIN &&
      shouldBootstrapAdmin(userId, existingEmail)
    ) {
      return prisma.user.update({
        where: { id: existingUser.id },
        data: { role: UserRole.ADMIN },
      });
    }

    return existingUser;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = normalizeEmail(
    clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress,
  );
  const phone =
    clerkUser.primaryPhoneNumber?.phoneNumber ??
    clerkUser.phoneNumbers[0]?.phoneNumber ??
    null;

  return prisma.user.create({
    data: {
      clerkUserId: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      phone,
      imageUrl: clerkUser.imageUrl,
      role: shouldBootstrapAdmin(clerkUser.id, email)
        ? UserRole.ADMIN
        : UserRole.CUSTOMER,
    },
  });
}

export async function requireAdminUser() {
  if (!isClerkConfigured()) {
    return null;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({
      returnBackUrl: "/admin",
    });
  }

  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return redirectToSignIn({
      returnBackUrl: "/admin",
    });
  }

  if (appUser.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return appUser;
}
