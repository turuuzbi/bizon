"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SortSelectProps = {
  value: string;
  options: Array<{ value: string; label: string }>;
  label: string;
};

export function SortSelect({ value, options, label }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next && next !== "featured") {
      params.set("sort", next);
    } else {
      params.delete("sort");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-[#3f3f46]">
      <span className="hidden font-medium sm:inline">{label}:</span>
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-[8px] border border-[#e4e4e7] bg-white px-2.5 py-2 text-sm text-[#18181b] outline-none transition-colors focus:border-[#8e55cf]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
