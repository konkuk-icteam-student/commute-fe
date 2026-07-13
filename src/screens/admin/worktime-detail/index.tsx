"use client";

import {
  WorktimeDetailQuickSearch,
  WorktimeDetailSection,
} from "@/features/admin/worktime";

export default function WorktimeDetailScreen() {
  return (
    <div className="flex flex-row">
      <WorktimeDetailSection />
      <WorktimeDetailQuickSearch />
    </div>
  );
}
