import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f3eee7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="rounded-[36px] bg-[#24362f] p-8 text-[#f7f2ea] shadow-[0_24px_60px_rgba(24,36,31,0.18)] sm:p-10 lg:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c7bf]">
            Bizon account
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2ea] sm:text-5xl">
            Create an account for catalog access and project workflows.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#dbe5df] sm:text-lg">
            New users are synced into Prisma on first access, and admin access
            is unlocked automatically when the account matches your bootstrap
            admin settings.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Customer accounts", "Trade-ready roles", "Admin bootstrap"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-[#f7f2ea]"
                >
                  {item}
                </span>
              ),
            )}
          </div>
          <div className="mt-10">
            <Link
              href="/"
              className="rounded-full bg-[#f7f2ea] px-6 py-3.5 text-sm font-semibold text-[#24362f] transition-colors hover:bg-white"
            >
              Back to storefront
            </Link>
          </div>
        </section>

        <section className="rounded-[36px] border border-black/10 bg-[#fffaf5] p-6 shadow-[0_24px_60px_rgba(34,28,20,0.06)] sm:p-8">
          <div className="flex justify-center">
            <SignUp fallbackRedirectUrl="/" signInUrl="/sign-in" />
          </div>
        </section>
      </div>
    </main>
  );
}
