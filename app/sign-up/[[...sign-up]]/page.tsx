import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { clerkAppearance } from "@/lib/clerk-appearance";

const authSyncRedirectUrl = "/auth/sync?redirect_url=/";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f6f1eb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="rounded-[36px] bg-[linear-gradient(160deg,#2f243a_0%,#6d36ad_100%)] p-8 text-[#f8f2ff] shadow-[0_24px_60px_rgba(54,31,79,0.2)] sm:p-10 lg:p-12">
          <BrandLogo size="lg" priority className="h-auto w-[116px] sm:w-[128px]" />
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d8c7ef]">
            Erka&apos;s account
          </p>
          <h1 className="mt-4 font-[family:var(--font-display)] text-4xl leading-[0.98] tracking-[-0.05em] text-[#f8f2ff] sm:text-5xl">
            Create an account for catalog access and project workflows.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#e6daf4] sm:text-lg">
            New users are synced into Prisma on first access, and admin access
            is unlocked automatically when the account matches your bootstrap
            admin settings.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Customer accounts", "Trade-ready roles", "Admin bootstrap"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.1] bg-white/[0.08] px-4 py-2 text-sm font-medium text-[#f8f2ff]"
                >
                  {item}
                </span>
              ),
            )}
          </div>
          <div className="mt-10">
            <Link
              href="/"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#4c236f] transition-colors hover:bg-[#f6edff]"
            >
              Back to storefront
            </Link>
          </div>
        </section>

        <section className="rounded-[36px] border border-black/10 bg-[#fffaf7] p-6 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-8">
          <div className="flex justify-center">
            <SignUp
              appearance={clerkAppearance}
              fallbackRedirectUrl={authSyncRedirectUrl}
              signInUrl="/sign-in"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
