import WorktimeDetailHeader from "../worktime-detail-header";
import WorktimeDetailTable from "../worktime-detail-table";

export default function WorktimeDetailSection() {
  return (
    <div className="flex w-full flex-col bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]">
      <WorktimeDetailHeader />
      <WorktimeDetailTable />
    </div>
  );
}
