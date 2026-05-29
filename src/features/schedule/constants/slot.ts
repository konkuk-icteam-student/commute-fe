import type { ScheduleRequestEditStatus, ScheduleSlotStatus } from "../types";

export const SLOTS_PER_DAY = 18; // 09:00 ~ 18:00 까지. 일주일은 총 90개

export const SLOT_STATUS_CLASS_NAME: Record<ScheduleSlotStatus, string> = {
  MY_SCHEDULE: "bg-[#51A8FF]",
  PENDING_DELETE: "border border-[#DDD9D9] bg-[#FFF9EA]",
  PENDING_ADD: "border border-[#DDD9D9] bg-[#EDF5FF]",
  UNAVAILABLE: "border border-[#DDD9D9] bg-[rgba(107,114,128,0.11)]",
  EMPTY: "border border-[#DDD9D9] bg-white",
};

export const SLOT_REQUEST_EDIT_CLASS_NAME: Record<
  ScheduleRequestEditStatus,
  string
> = {
  REQUEST_ADD: "border border-[#1D4ED8] bg-[#DBEAFE]",
  REQUEST_DELETE: "border border-[#FD7171] bg-[#FFF4D7]",
};
