import { dashboardWorkerColors } from "../../constants";
import { AdminWorkScheduleList } from "@/components/ui";
import type { DashboardTimeRow } from "../../types";
import DashboardPanel from "../dashboard-panel";

function getWorkerColor(workerId: string) {
  const colorSeed = Array.from(workerId).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const colorIndex = colorSeed % dashboardWorkerColors.length;
  return dashboardWorkerColors[colorIndex];
}

export default function TimeTablePanel({
  rows,
  isError = false,
  isLoading = false,
}: {
  rows: DashboardTimeRow[];
  isError?: boolean;
  isLoading?: boolean;
}) {
  const morningRows = rows.filter((row) => row.periodCode === "MORNING");
  const afternoonRows = rows.filter((row) => row.periodCode === "AFTERNOON");

  return (
    <DashboardPanel title="오늘 근무 시간표" arrowHref="/admin/worktime/detail">
      <div className="mx-5.25 mb-5 rounded-xl border border-[#DDE3EF] bg-white p-4 pr-5.25">
        {isLoading ? (
          <p className="py-20 text-center text-[13px] font-bold text-[#8892A6]">
            오늘 근무 시간표를 불러오는 중입니다.
          </p>
        ) : isError ? (
          <p className="py-20 text-center text-[13px] font-bold text-[#8892A6]">
            오늘 근무 시간표를 불러오지 못했습니다.
          </p>
        ) : rows.length === 0 ? (
          <p className="py-20 text-center text-[13px] font-bold text-[#8892A6]">
            등록된 근무 시간표가 없습니다.
          </p>
        ) : (
          <AdminWorkScheduleList
            groups={[
              {
                title: "오전",
                rows: morningRows.map(toScheduleRow),
                workerShape: "rounded",
              },
              {
                title: "오후",
                rows: afternoonRows.map(toScheduleRow),
                workerShape: "rounded",
              },
            ]}
            variant="dashboard"
          />
        )}
      </div>
    </DashboardPanel>
  );
}

function toScheduleRow(row: DashboardTimeRow) {
  return {
    countLabel: `${row.currentCount}명`,
    id: row.id,
    time: row.start,
    workers: row.workers.map((worker) => ({
      className: getWorkerColor(worker.id),
      id: worker.id,
      name: worker.name,
    })),
  };
}
