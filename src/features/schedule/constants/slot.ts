import { ScheduleSlotStatus } from "../types";

export const SLOTS_PER_DAY = 18; // 09:00 ~ 18:00 까지. 일주일은 총 90개

export const SLOT_STATUS_CLASS_NAME: Record<ScheduleSlotStatus, string> = {
  MY_SCHEDULE: "bg-[#51A8FF]",
  PENDING_DELETE: "border border-0.5 border-[#FFD280] bg-[#FFF9EA]",
  PENDING_ADD: "border border-0.5 border-[#769EF3] bg-[#DBEAFE]",
  UNAVAILABLE: "border border-0.5 border-[#DDD9D9] bg-[rgba(107,114,128,0.11)]",
  EMPTY: "border border-0.5 border-[#DDD9D9] bg-white",
};
