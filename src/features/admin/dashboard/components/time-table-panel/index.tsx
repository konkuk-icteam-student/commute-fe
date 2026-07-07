import DashboardSectionHeader from "../dashboard-section-header";
import { dashboardWorkerColors } from "../../constants";
import type { DashboardTimeRow } from "../../types";

function getWorkerColor(workerId: string) {
  const colorSeed = Array.from(workerId).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const colorIndex = colorSeed % dashboardWorkerColors.length;
  return dashboardWorkerColors[colorIndex];
}

export default function TimeTablePanel({ rows }: { rows: DashboardTimeRow[] }) {
  const morningRows = rows.filter((row) => row.periodCode === "MORNING");
  const afternoonRows = rows.filter((row) => row.periodCode === "AFTERNOON");

  return (
    <section className="rounded-xl border border-[#DDE3EF] bg-[#F4F5F7]">
      <DashboardSectionHeader
        title="오늘 근무 시간표"
        arrowHref="/admin/worktime/detail"
      />
      <div className="mx-4 mb-4 rounded-xl border border-[#DDE3EF] bg-white p-4 min-[1728px]:mx-5.25 min-[1728px]:mb-5 min-[1728px]:pr-5.25">
        <p className="mb-2 px-1.5 text-sm leading-3.5 font-bold text-[#000000]">
          오전
        </p>
        <div>
          {morningRows.map((row) => (
            <TimeTableRow key={row.id} row={row} />
          ))}
        </div>

        <p className="mt-6 mb-2 px-1.5 text-sm leading-3.5 font-bold text-[#000000]">
          오후
        </p>
        <div>
          {afternoonRows.map((row) => (
            <TimeTableRow key={row.id} row={row} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimeTableRow({ row }: { row: DashboardTimeRow }) {
  return (
    <div className="grid min-h-10 grid-cols-[minmax(0,1fr)_28px] items-start border-b-[0.3px] border-[#DDE3EF] p-2 last:border-b-0">
      <div className="flex min-w-0 items-start gap-5">
        <span className="w-9.75 shrink-0 text-[15px] font-medium text-[#000000]">
          {row.start}
        </span>
        <div className="flex min-w-0 flex-wrap gap-x-2 gap-y-1.5">
          {row.workers.map((worker) => (
            <span
              key={`${row.id}-${worker.id}`}
              className={`flex h-6 min-w-12.75 items-center justify-center px-2 text-[12px] font-bold whitespace-nowrap ${
                row.periodCode === "MORNING" ? "rounded-lg" : "rounded-2xl"
              } ${getWorkerColor(worker.id)}`}
            >
              {worker.name}
            </span>
          ))}
        </div>
      </div>
      <p className="pt-1 text-right text-[12px] font-medium text-[#C2C4C6]">
        {row.currentCount}명
      </p>
    </div>
  );
}
