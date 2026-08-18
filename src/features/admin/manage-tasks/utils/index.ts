import type { GetAdminWorkSchedulesResponse } from "@/apis/work-schedules";
import type { BadgeVariant } from "@/components/ui";

import type { ManageTaskScheduleGroup, ManageTaskStudent } from "../types";

const studentTones = [
  "student-blue",
  "student-green",
  "student-red",
  "student-orange",
  "student-cyan",
  "student-pink",
  "student-purple",
] as const satisfies BadgeVariant[];

const getStudentTone = (userId: string): ManageTaskStudent["tone"] => {
  const toneIndex =
    Array.from(userId).reduce(
      (sum, character) => sum + character.charCodeAt(0),
      0,
    ) % studentTones.length;

  return studentTones[toneIndex];
};

export const toManageTaskScheduleGroups = (
  response?: GetAdminWorkSchedulesResponse,
): ManageTaskScheduleGroup[] => {
  const slots = response?.days[0]?.slots ?? [];
  const groups: ManageTaskScheduleGroup[] = [
    { title: "오전", items: [] },
    { title: "오후", items: [] },
  ];

  slots
    .filter((slot) => slot.status !== "UNAVAILABLE")
    .forEach((slot) => {
      const hour = Number(slot.start.split(":")[0]);
      const targetGroup = groups[hour < 12 ? 0 : 1];

      targetGroup.items.push({
        time: slot.start,
        students: slot.users.map((user) => ({
          name: user.userName,
          tone: getStudentTone(user.userId),
        })),
      });
    });

  return groups;
};
