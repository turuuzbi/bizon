"use client";

import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  className?: string;
};

export function AdminSubmitButton({
  label,
  pendingLabel,
  className,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "rounded-full bg-[#24362f] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1c2924] disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {pending ? pendingLabel ?? "Saving..." : label}
    </button>
  );
}
