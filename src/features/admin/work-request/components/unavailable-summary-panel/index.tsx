import Image from "next/image";

import deleteXIcon from "@/assets/icons/admin-worktime-request/ic_delete_x.svg";
import type { WorkRequestTimeRange } from "../../types";
import { formatWorkRequestDateLabel } from "../../utils";

const UNAVAILABLE_PANEL_MAX_WIDTH = 330;
const UNAVAILABLE_PANEL_PADDING_X = 32;
const UNAVAILABLE_PANEL_ITEM_GAP = 8;
const UNAVAILABLE_PANEL_EMPTY_WIDTH = 198;
const DATE_ITEM_WIDTH = 143;
const TIME_ITEM_WIDTH = 132;

export default function UnavailableSummaryPanel({
  isEditing,
  isActive,
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
  const showRemoveButtons = !isActive || isEditing;
  const unavailableDateItems = unavailableDates.map((date, index) => ({
    id: `${date}-${index}`,
    label: formatWorkRequestDateLabel(date),
    onRemove: () => onRemoveUnavailableDate(index),
  }));
  const unavailableTimeRangeItems = unavailableTimeRanges.map(
    (timeRange, index) => ({
      id: `${timeRange.start}-${timeRange.end}-${index}`,
      label: `${timeRange.start} ~ ${timeRange.end}`,
      onRemove: () => onRemoveUnavailableTimeRange(index),
    }),
  );
  const panelWidth = getUnavailablePanelWidth({
    dateCount: unavailableDateItems.length,
    timeCount: unavailableTimeRangeItems.length,
  });

  return (
    <aside
      className="rounded-xl border border-[#DDE3EF] bg-[#F7F8FA] px-4 py-6"
      style={{ width: panelWidth }}
    >
      <InfoGroup
        itemWidth={DATE_ITEM_WIDTH}
        showRemoveButtons={showRemoveButtons}
        title="신청 불가 일자"
        values={unavailableDateItems}
      />
      <InfoGroup
        className="mt-6"
        itemWidth={TIME_ITEM_WIDTH}
        showRemoveButtons={showRemoveButtons}
        title="신청 불가 시간대"
        values={unavailableTimeRangeItems}
      />
    </aside>
  );
}

function getUnavailablePanelWidth({
  dateCount,
  timeCount,
}: {
  dateCount: number;
  timeCount: number;
}) {
  const dateWidth = getGroupWidth(dateCount, DATE_ITEM_WIDTH);
  const timeWidth = getGroupWidth(timeCount, TIME_ITEM_WIDTH);
  const contentWidth = Math.max(dateWidth, timeWidth);

  if (contentWidth === 0) {
    return UNAVAILABLE_PANEL_EMPTY_WIDTH;
  }

  return Math.min(
    contentWidth + UNAVAILABLE_PANEL_PADDING_X,
    UNAVAILABLE_PANEL_MAX_WIDTH,
  );
}

function getGroupWidth(itemCount: number, itemWidth: number) {
  if (itemCount === 0) {
    return 0;
  }

  const visibleColumnCount = Math.min(itemCount, 2);

  return (
    visibleColumnCount * itemWidth +
    (visibleColumnCount - 1) * UNAVAILABLE_PANEL_ITEM_GAP
  );
}

function InfoGroup({
  className = "",
  itemWidth,
  showRemoveButtons,
  title,
  values,
}: {
  className?: string;
  itemWidth: number;
  showRemoveButtons: boolean;
  title: string;
  values: { id: string; label: string; onRemove: () => void }[];
}) {
  const columnCount = Math.min(Math.max(values.length, 1), 2);

  return (
    <div className={className}>
      <h3 className="mb-3.5 text-base font-bold whitespace-nowrap text-[#1A2236]">
        {title}
      </h3>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, ${itemWidth}px)`,
        }}
      >
        {values.map((value) => (
          <div
            key={value.id}
            className="flex h-8 min-w-0 items-center justify-center gap-2.5 rounded-xl border border-[#DDE3EF] bg-white px-3 text-sm font-medium whitespace-nowrap text-[#464C53]"
            style={{ width: itemWidth }}
          >
            <span className="whitespace-nowrap">{value.label}</span>
            {showRemoveButtons ? (
              <button
                type="button"
                className="flex h-3 w-3 shrink-0 cursor-pointer items-center justify-center"
                aria-label={`${value.label} 삭제`}
                onClick={value.onRemove}
              >
                <Image
                  src={deleteXIcon}
                  alt=""
                  width={12}
                  height={12}
                  className="h-3 w-3"
                />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
