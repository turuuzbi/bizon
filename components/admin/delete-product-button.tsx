"use client";

import { useFormStatus } from "react-dom";

import { useLocale } from "@/components/locale-provider";

type DeleteProductButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  productName: string;
};

function DeleteButtonInner() {
  const { t } = useLocale();
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-[#d9b7b7] px-5 py-3 text-sm font-semibold text-[#7a2f2f] transition-colors hover:bg-[#fbefef] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? t.admin.deleteButton.deleting : t.admin.deleteButton.delete}
    </button>
  );
}

export function DeleteProductButton({
  action,
  productName,
}: DeleteProductButtonProps) {
  const { t, format } = useLocale();

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            format(t.admin.deleteButton.confirmDelete, { name: productName }),
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <DeleteButtonInner />
    </form>
  );
}
