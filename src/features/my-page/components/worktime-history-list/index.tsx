type WorktimeHistoryStatus = "approved" | "pending" | "rejected";
type WorktimeHistoryChangeType = "add" | "delete";

interface WorktimeHistoryListProps {
  period: string;
  items: ReadonlyArray<{
    id: number;
    status: WorktimeHistoryStatus;
    statusLabel: string;
    processedAt?: string;
    requestedAt: string;
    changes: ReadonlyArray<{
      id: number;
      type: WorktimeHistoryChangeType;
      text: string;
      hours: string;
    }>;
  }>;
}

const statusClassNames = {
  approved: "bg-[#DBEAFE] text-[#2563EB]",
  pending: "bg-[#FFF1CC] text-[#B98316]",
  rejected: "bg-[#FFE3E3] text-[#D94B62]",
} as const;

const dotClassNames = {
  add: "bg-[#2563EB]",
  delete: "bg-[#FF7171]",
} as const;

export default function WorktimeHistoryList({
  period,
  items,
}: WorktimeHistoryListProps) {
  return (
    <section>
      <p className="pr-2 text-right text-[14px] leading-5 font-bold text-[#8892A6]">
        {period}
      </p>

      <div className="mt-3 flex flex-col gap-5">
        {items.map((item) => (
          <article
            className="rounded-[20px] border-[0.5px] border-[#DDE3EF] bg-white px-5 py-4 shadow-[0_2px_8px_0_#F3F2F2]"
            key={item.id}
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className={`flex h-[26px] min-w-[56px] items-center justify-center rounded-full px-3 text-[14px] leading-5 font-bold ${statusClassNames[item.status]}`}
              >
                {item.statusLabel}
              </span>
              {item.processedAt ? (
                <span className="text-[12px] leading-4.5 font-bold text-[#8892A6]">
                  {item.processedAt}
                </span>
              ) : null}
            </div>

            <ul className="mt-3 flex flex-col gap-1">
              {item.changes.map((change) => (
                <li
                  className="flex items-center gap-1.5 text-[14px] leading-5 font-bold text-[#1A2236]"
                  key={change.id}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClassNames[change.type]}`}
                    aria-hidden="true"
                  />
                  <span>{change.text}</span>
                  <span className="font-bold text-[#8892A6]">
                    ({change.hours})
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[10px] leading-4 font-medium text-[#8892A6]">
              {item.requestedAt}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
