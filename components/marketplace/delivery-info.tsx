import type { Dictionary } from "@/lib/i18n";

type DeliveryStrings = Dictionary["marketplace"]["delivery"];

const truckIcon = "M1 3h15v13H1z M16 8h4l3 3v5h-7z";
const storeIcon = "M3 9 4 4h16l1 5M4 9v11h16V9M9 20v-6h6v6";
const mapIcon = "M9 20 3 17V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13";

/**
 * Presentational delivery/pickup panel for the product page. Static, illustrative
 * copy for now — the data model (Address.district / deliveryInstructions,
 * Order.shippingAmount) already exists to make this dynamic later.
 */
export function DeliveryInfo({ strings }: { strings: DeliveryStrings }) {
  const options = [
    {
      icon: truckIcon,
      title: strings.cityDelivery,
      note: strings.cityDeliveryEta,
      badge: strings.freeOver,
    },
    {
      icon: storeIcon,
      title: strings.pickup,
      note: strings.pickupEta,
      badge: null,
    },
    {
      icon: mapIcon,
      title: strings.outOfCity,
      note: strings.outOfCityNote,
      badge: null,
    },
  ];

  return (
    <div className="rounded-[10px] border border-[#e4e4e7] bg-white">
      <div className="flex items-center gap-2 border-b border-[#e4e4e7] px-4 py-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-[#8e55cf]"
        >
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 3v5h-7z" />
          <circle cx="5.5" cy="18.5" r="2" />
          <circle cx="18.5" cy="18.5" r="2" />
        </svg>
        <h3 className="text-sm font-semibold text-[#18181b]">{strings.title}</h3>
      </div>

      <ul className="divide-y divide-[#e4e4e7]">
        {options.map((option) => (
          <li key={option.title} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f6f6f7] text-[#3f3f46]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d={option.icon} />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#18181b]">{option.title}</p>
              <p className="text-xs text-[#71717a]">{option.note}</p>
              {option.badge ? (
                <span className="mt-1 inline-flex rounded-[6px] bg-[#ecfdf3] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]">
                  {option.badge}
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1.5 border-t border-[#e4e4e7] bg-[#f6f6f7] px-4 py-3">
        <p className="flex items-start gap-2 text-xs text-[#3f3f46]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8e55cf]"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {strings.scheduledNote}
        </p>
        <p className="flex items-start gap-2 text-xs text-[#3f3f46]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8e55cf]"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
          </svg>
          {strings.bulkNote}
        </p>
      </div>
    </div>
  );
}
