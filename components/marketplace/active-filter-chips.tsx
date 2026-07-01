import Link from "next/link";

export type ActiveFilterChip = {
  key: string;
  label: string;
  href: string;
};

type ActiveFilterChipsProps = {
  chips: ActiveFilterChip[];
  clearAllHref: string;
  title: string;
  clearAllLabel: string;
};

export function ActiveFilterChips({
  chips,
  clearAllHref,
  title,
  clearAllLabel,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-[#71717a]">{title}:</span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e4e7] bg-white px-3 py-1 text-xs font-medium text-[#3f3f46] transition-colors hover:border-[#8e55cf] hover:text-[#8e55cf]"
        >
          {chip.label}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Link>
      ))}
      <Link
        href={clearAllHref}
        className="text-xs font-semibold text-[#8e55cf] hover:text-[#7d45c1]"
      >
        {clearAllLabel}
      </Link>
    </div>
  );
}
