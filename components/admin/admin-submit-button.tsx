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
        "rounded-full bg-[#8e55cf] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d45c1] disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {pending ? pendingLabel ?? "Saving..." : label}
    </button>
  );
}
