"use client";

import { useTransition } from "react";

import { setLocale } from "@/lib/locale-actions";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  current: Locale;
  variant?: "utility" | "inline";
};

export function LanguageSwitcher({
  current,
  variant = "utility",
}: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: Locale) => {
    if (locale === current || isPending) return;
    startTransition(() => {
      void setLocale(locale);
    });
  };

  const base =
    variant === "utility"
      ? "inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-[11px] font-semibold uppercase tracking-[0.1em]"
      : "inline-flex items-center rounded-full border border-black/10 bg-white p-0.5 text-[11px] font-semibold uppercase tracking-[0.1em]";

  const activeClass =
    variant === "utility"
      ? "bg-white text-[#7c3aed]"
      : "bg-[#7c3aed] text-white";
  const idleClass =
    variant === "utility"
      ? "text-white/80 hover:text-white"
      : "text-[#44444c] hover:text-[#7c3aed]";

  return (
    <div className={base} aria-label="Language switcher">
      <button
        type="button"
        onClick={() => switchTo("mn")}
        className={`rounded-lg px-3 py-1 transition-colors ${
          current === "mn" ? activeClass : idleClass
        }`}
        disabled={isPending}
      >
        MN
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`rounded-lg px-3 py-1 transition-colors ${
          current === "en" ? activeClass : idleClass
        }`}
        disabled={isPending}
      >
        EN
      </button>
    </div>
  );
}
