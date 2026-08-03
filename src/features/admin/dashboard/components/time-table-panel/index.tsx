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

export default function TimeTablePanel({ rows }: { rows: DashboardTimeRow[] }) {
  const morningRows = rows.filter((row) => row.periodCode === "MORNING");
  const afternoonRows = rows.filter((row) => row.periodCode === "AFTERNOON");

  return (
    <DashboardPanel title="오늘 근무 시간표" arrowHref="/admin/worktime/detail">
      <div className="mx-5.25 mb-5 rounded-xl border border-[#DDE3EF] bg-white p-4 pr-5.25">
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
