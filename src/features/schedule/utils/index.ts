import { WeekScheduleData } from "../types";

type ScheduleSlot = WeekScheduleData["slots"][number];

export const chunkScheduleSlots = (
  slots: ScheduleSlot[],
  slotsPerDay: number,
) => {
  if (!Number.isInteger(slotsPerDay) || slotsPerDay <= 0) {
    throw new RangeError("하루 슬롯 개수는 양의 정수여야 합니다.");
  }

  return Array.from(
    { length: Math.ceil(slots.length / slotsPerDay) },
    (_, index) => slots.slice(index * slotsPerDay, (index + 1) * slotsPerDay),
  );
};
