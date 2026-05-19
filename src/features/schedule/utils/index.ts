import { WeekSheduleData } from "../types";

type ScheduleSlot = WeekSheduleData["slots"][number];

export const chunkScheduleSlots = (
  slots: ScheduleSlot[],
  slotsPerDay: number,
) =>
  Array.from({ length: Math.ceil(slots.length / slotsPerDay) }, (_, index) =>
    slots.slice(index * slotsPerDay, (index + 1) * slotsPerDay),
  );
