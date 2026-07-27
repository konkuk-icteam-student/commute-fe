import { Badge, type BadgeVariant } from "@/components/ui";
import { cn } from "@/lib/utils";

export type AdminWorkScheduleWorker = {
  className?: string;
  id?: number | string;
  name: string;
  tone?: BadgeVariant;
};

export type AdminWorkScheduleRow = {
  countLabel: string;
  id?: number | string;
  time: string;
  workers: AdminWorkScheduleWorker[];
};

export type AdminWorkScheduleGroup = {
  rows: AdminWorkScheduleRow[];
  title: string;
  workerShape?: "pill" | "rounded";
};

type AdminWorkScheduleListProps = {
  groups: AdminWorkScheduleGroup[];
  variant?: "compact" | "dashboard";
};

export default function AdminWorkScheduleList({
  groups,
  variant = "compact",
}: AdminWorkScheduleListProps) {
  return (
    <div className={variant === "compact" ? "space-y-4" : undefined}>
      {groups.map((group, groupIndex) => (
        <div key={group.title}>
          <p
            className={
              variant === "dashboard"
                ? cn(
                    "mb-2 px-1.5 text-sm leading-3.5 font-bold text-[#000000]",
                    groupIndex > 0 && "mt-6",
                  )
                : "mb-1.5 text-sm font-bold text-[#1A2236]"
            }
          >
            {group.title}
          </p>
          <div>
            {group.rows.map((row, rowIndex) => (
              <ScheduleRow
                group={group}
                key={row.id ?? `${group.title}-${row.time}`}
                row={row}
                rowIndex={rowIndex}
                variant={variant}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleRow({
  group,
  row,
  rowIndex,
  variant,
}: {
  group: AdminWorkScheduleGroup;
  row: AdminWorkScheduleRow;
  rowIndex: number;
  variant: "compact" | "dashboard";
}) {
  if (variant === "dashboard") {
    return (
      <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_28px] items-start border-b-[0.3px] border-[#DDE3EF] p-2 last:border-b-0">
        <div className="flex min-w-0 items-start gap-5">
          <time className="w-9.75 shrink-0 text-[15px] font-medium text-[#000000]">
            {row.time}
          </time>
          <div className="flex min-w-0 flex-wrap gap-x-2 gap-y-1.5">
            {row.workers.map((worker) => (
              <WorkerBadge
                key={worker.id ?? `${row.time}-${worker.name}`}
                shape={group.workerShape}
                variant="dashboard"
                worker={worker}
              />
            ))}
          </div>
        </div>
        <p className="pt-1 text-right text-[12px] font-medium text-[#C2C4C6]">
          {row.countLabel}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-[37px_1fr_28px] gap-3 border-b border-[#EEF1F6] last:border-b-0",
        rowIndex === 0 ? "h-9 items-start" : "min-h-11 items-center py-2",
      )}
    >
      <time className="flex h-5.25 w-9.25 items-center justify-center text-[14px] font-medium text-black">
        {row.time}
      </time>
      <div
        className={cn(
          "flex flex-wrap gap-1.5",
          rowIndex === 0 && "h-5.25 items-center",
        )}
      >
        {row.workers.map((worker) => (
          <WorkerBadge
            key={worker.id ?? `${row.time}-${worker.name}`}
            shape={group.workerShape}
            variant="compact"
            worker={worker}
          />
        ))}
      </div>
      <span className="flex h-5.25 items-center justify-end text-[11px] leading-3.75 text-[#C2C4C6]">
        {row.countLabel}
      </span>
    </div>
  );
}

function WorkerBadge({
  shape = "pill",
  variant,
  worker,
}: {
  shape?: "pill" | "rounded";
  variant: "compact" | "dashboard";
  worker: AdminWorkScheduleWorker;
}) {
  if (variant === "compact" && worker.tone) {
    return <Badge text={worker.name} variant={worker.tone} />;
  }

  return (
    <span
      className={cn(
        "flex items-center justify-center font-bold whitespace-nowrap",
        variant === "dashboard"
          ? "h-6 min-w-12.75 px-2 text-[12px]"
          : "h-5.25 rounded-2xl px-2 text-[11px] leading-none",
        shape === "rounded" ? "rounded-lg" : "rounded-2xl",
        worker.className,
      )}
    >
      {worker.name}
    </span>
  );
}
