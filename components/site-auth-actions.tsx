"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type ViewerState = {
  role: "CUSTOMER" | "STAFF" | "ADMIN" | null;
};

export function SiteAuthActions() {
  const { isLoaded, userId } = useAuth();
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadViewer() {
      if (!isLoaded || !userId) {
        setViewer(null);
        return;
      }

      try {
        const response = await fetch("/api/account/me", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          setViewer(null);
          return;
        }

        const payload = (await response.json()) as ViewerState;

        if (!cancelled) {
          setViewer(payload);
        }
      } catch {
        if (!cancelled) {
          setViewer(null);
        }
      }
    }

    void loadViewer();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  if (!isLoaded) {
    return (
      <div className="h-10 w-[188px] rounded-full border border-black/10 bg-white/60" />
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/sign-in"
          className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-[#2d2a27] transition-colors hover:border-[#24362f] hover:text-[#24362f]"
        >
          Нэвтрэх
        </Link>
        <Link
          href="/sign-up"
          className="rounded-full bg-[#24362f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1c2924]"
        >
          Бүртгүүлэх
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {viewer?.role === "ADMIN" ? (
        <Link
          href="/admin"
          prefetch={false}
          className="rounded-full bg-[#24362f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1c2924]"
        >
          Admin Panel
        </Link>
      ) : null}
      <div className="flex h-10 items-center rounded-full border border-black/10 bg-white px-1.5">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </div>
  );
}
