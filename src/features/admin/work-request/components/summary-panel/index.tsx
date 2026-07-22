import { cn } from "@/lib/utils";
import type { WorkRequestTimeRange } from "../../types";
import SummaryTable from "../summary-table";
import UnavailableSummaryPanel from "../unavailable-summary-panel";

export default function SummaryPanel({
  isActive,
  isEditing,
  onRemoveUnavailableDate,
  onRemoveUnavailableTimeRange,
  unavailableDates,
  unavailableTimeRanges,
}: {
  isActive: boolean;
  isEditing: boolean;
  onRemoveUnavailableDate: (index: number) => void;
  onRemoveUnavailableTimeRange: (index: number) => void;
  unavailableDates: string[];
  unavailableTimeRanges: WorkRequestTimeRange[];
}) {
  return (
    <section className="relative mt-12.75 min-h-109.5 rounded-xl border border-[#DDE3EF] bg-white pt-8 pr-10 pb-6.75 pl-8">
      <div className="mb-5.5 flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-[#1A2236]">근로신청 요약</h2>
        <button
          type="button"
          className={cn(
            "h-11.5 w-51.5 rounded-md text-base font-semibold",
            isActive
              ? "cursor-pointer bg-[#2076FF] text-white"
              : "bg-[#EFEFF1] text-[#6D7882]",
          )}
        >
          시간표 자세히보기
        </button>
      </div>

      <div className="grid min-h-75 grid-cols-[minmax(0,1fr)_max-content] gap-11">
        {isActive ? (
          <SummaryTable />
        ) : (
          <>
            <div className="min-w-0" />
            <EmptyState />
          </>
        )}

        <UnavailableSummaryPanel
          isActive={isActive}
          isEditing={isEditing}
          onRemoveUnavailableDate={onRemoveUnavailableDate}
          onRemoveUnavailableTimeRange={onRemoveUnavailableTimeRange}
          unavailableDates={unavailableDates}
          unavailableTimeRanges={unavailableTimeRanges}
        />
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
      <div>
        <p className="text-[19px] font-bold text-[#8892A6]">
          근로신청이 시작되지 않았습니다.
        </p>
        <p className="text-[19px] text-[#8892A6]">
          신청 기간을 설정한 뒤 신청받기를 눌러 시작하세요.
        </p>
      </div>
    </div>
  );
}
