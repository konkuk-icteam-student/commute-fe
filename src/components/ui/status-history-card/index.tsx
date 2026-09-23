export type StatusHistoryCardTone =
  | "pending"
  | "notice"
  | "approved"
  | "rejected";

interface StatusHistoryCardItem {
  key: string;
  text: string;
  type: "add" | "delete";
}

interface StatusHistoryCardProps {
  statusLabel: string;
  tone: StatusHistoryCardTone;
  title?: string;
  processedAt?: string;
  items: StatusHistoryCardItem[];
  reason?: string | null;
  footer: string;
  footerDateTime?: string;
}

const badgeClassNames: Record<StatusHistoryCardTone, string> = {
  pending: "bg-[#FFF4D7] text-[#B88A42]",
  notice: "bg-[#FFF4D7] text-[#B88A42]",
  approved: "bg-[#DBEAFE] text-[#2563EB]",
  rejected: "bg-[#FFE4E4] text-[#C44B5F]",
};

const itemDotClassNames: Record<StatusHistoryCardItem["type"], string> = {
  add: "bg-[#2563EB]",
  delete: "bg-[#C44B5F]",
};

export default function StatusHistoryCard({
  statusLabel,
  tone,
  title,
  processedAt,
  items,
  reason,
  footer,
  footerDateTime,
}: StatusHistoryCardProps) {
  return (
    <article className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-3.75 py-2.75 shadow-[0_2px_8px_0_#F3F2F2]">
      <div className="flex items-center justify-between gap-4">
        <span
          className={`flex h-4.75 w-fit min-w-10.25 items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-bold ${badgeClassNames[tone]}`}
        >
          {statusLabel}
        </span>
        {processedAt ? (
          <span className="text-[9px] leading-4.5 font-bold text-[#8892A6]">
            {processedAt}
          </span>
        ) : null}
      </div>

      <div className="ml-1">
        {title ? (
          <h2 className="mt-1.5 text-[11px] leading-4.5 font-bold text-[#1A2236]">
            {title}
          </h2>
        ) : null}

        {items.length > 0 ? (
          <ul
            className={`${title ? "mt-2" : "mt-3"} ml-[2.5px] flex flex-col gap-1`}
          >
            {items.map((item) => (
              <li
                className="flex items-center gap-[8.5px] text-[10px] leading-4.5 font-medium text-[#1A2236]"
                key={item.key}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.25 w-1.25 shrink-0 rounded-full ${itemDotClassNames[item.type]}`}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {reason ? (
          <p className="mt-2.5 text-[10px] leading-4.5 font-medium text-[#1A2236]">
            반려사유 : {reason}
          </p>
        ) : null}

        <time
          className="mt-2 block text-[8px] leading-2.5 font-medium text-[#8892A6]"
          dateTime={footerDateTime}
        >
          {footer}
        </time>
      </div>
    </article>
  );
}
