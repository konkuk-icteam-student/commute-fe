import {
  WorktimeEditRequestSection,
  WorktimeScheduleSection,
} from "@/features/admin/worktime";

export default function WorktimeScreen() {
  return (
    <div className="flex justify-center gap-6">
      <WorktimeScheduleSection />
      <WorktimeEditRequestSection />
    </div>
  );
}
