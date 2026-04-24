import type { Metadata } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { isClerkConfigured, requireAdminUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin | Bizon",
  description: "Bizon admin dashboard",
};

const navigationItems = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Catalog data", href: "/admin#catalog" },
  { label: "Orders", href: "/admin#orders" },
  { label: "Customers", href: "/admin#customers" },
] as const;

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isClerkConfigured()) {
    return (
      <main className="min-h-screen bg-[#f3eee7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[36px] border border-black/10 bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
            Clerk Setup Required
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a17] sm:text-5xl">
            Admin panel is ready, but Clerk still needs keys.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#625f5a] sm:text-lg">
            Add your Clerk publishable key, secret key, and redirect URLs to the
            env file first. After that, sign in with an email listed in
            `ADMIN_EMAILS` or add your Clerk user ID to `ADMIN_CLERK_USER_IDS`
            to bootstrap admin access.
          </p>
          <div className="mt-8 rounded-[28px] border border-black/10 bg-[#f6f1ea] p-5 text-sm leading-7 text-[#4f4a43]">
            <p>`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`</p>
            <p>`CLERK_SECRET_KEY`</p>
            <p>`NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`</p>
            <p>`NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`</p>
            <p>`ADMIN_EMAILS=you@example.com`</p>
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="rounded-full bg-[#24362f] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1c2924]"
            >
              Back to storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const adminUser = await requireAdminUser();
  const adminName =
    [adminUser?.firstName, adminUser?.lastName].filter(Boolean).join(" ") ||
    adminUser?.email ||
    "Admin user";

  return (
    <div className="min-h-screen bg-[#f3eee7]">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[32px] bg-[#24362f] p-6 text-[#f7f2ea] shadow-[0_24px_60px_rgba(24,36,31,0.18)]">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-sm font-medium text-[#f7f2ea] transition-colors hover:bg-white/[0.08]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f2ea] text-xs font-bold uppercase tracking-[0.18em] text-[#24362f]">
              BZ
            </span>
            Back to store
          </Link>

          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c7bf]">
              Control center
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#f7f2ea]">
              Bizon admin panel
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#dbe5df]">
              Catalog, orders, and customer activity in one calm workspace with
              server-side role protection.
            </p>
          </div>

          <div className="mt-8 rounded-[26px] border border-white/[0.12] bg-white/[0.06] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c7bf]">
              Signed in as
            </p>
            <p className="mt-3 text-xl font-semibold text-[#f7f2ea]">
              {adminName}
            </p>
            <p className="mt-2 text-sm text-[#dbe5df]">
              Role: {adminUser?.role ?? "ADMIN"}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-[20px] border border-white/[0.08] px-4 py-3 text-sm font-medium text-[#f7f2ea] transition-colors hover:bg-white/[0.06]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[32px] border border-black/10 bg-[#fffaf5]/90 px-5 py-4 shadow-[0_24px_60px_rgba(34,28,20,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#536458]">
                Protected workspace
              </p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1d1a17]">
                Role-checked admin access is active.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#24362f] hover:text-[#24362f]"
              >
                View storefront
              </Link>
              <div className="flex h-10 items-center rounded-full border border-black/10 bg-white px-1.5">
                <UserButton />
              </div>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
