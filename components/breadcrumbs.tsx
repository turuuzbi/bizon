import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1.5 text-xs text-[#71717a]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 shrink-0 text-[#d4d4d8]"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="whitespace-nowrap transition-colors hover:text-[#8e55cf]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`whitespace-nowrap ${
                    isLast ? "font-medium text-[#18181b]" : ""
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
