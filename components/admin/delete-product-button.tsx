"use client";

import { useFormStatus } from "react-dom";

type DeleteProductButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  productName: string;
};

function DeleteButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-[#d9b7b7] px-5 py-3 text-sm font-semibold text-[#7a2f2f] transition-colors hover:bg-[#fbefef] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Deleting..." : "Delete Product"}
    </button>
  );
}

export function DeleteProductButton({
  action,
  productName,
}: DeleteProductButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${productName}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <DeleteButtonInner />
    </form>
  );
}
