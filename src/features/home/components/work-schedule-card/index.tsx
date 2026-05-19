import { Badge, type BadgeVariant } from "@/components/ui";

export type WorkScheduleStatus =
  | "working"
  | "scheduled"
  | "absent"
  | "completed";

export type WorkSchedule = {
  id: number;
  title: string;
  time: string;
  status: WorkScheduleStatus;
};

const statusVariant: Record<WorkScheduleStatus, BadgeVariant> = {
  working: "blue",
  scheduled: "gray",
  absent: "red",
  completed: "green",
};

const statusLabel = {
  working: "근무중",
  scheduled: "예정",
  absent: "결근",
  completed: "근무 완료",
};

type WorkScheduleCardProps = {
  schedules: WorkSchedule[];
};

export default function WorkScheduleCard({ schedules }: WorkScheduleCardProps) {
  return (
    <div className="mt-4 w-[86vw] max-w-full rounded-[20px] border border-[#DDE3EF] px-5.5 py-3.25">
      <h2 className="text-[11px] leading-5 font-bold text-[#8892A6]">
        오늘의 근무 일정
      </h2>

      <ul className="mt-5 divide-y divide-[#F0F2F8]">
        {schedules.map((schedule) => (
          <li
            className="flex justify-between gap-4 py-2.5 first:pt-0 last:pb-1"
            key={schedule.id}
          >
            <div>
              <p className="text-[13px] leading-5 font-bold text-[#1A2236]">
                {schedule.title}
              </p>
              <p className="mt-1 text-[11px] leading-4 font-bold text-[#8892A6]">
                {schedule.time}
              </p>
            </div>
            <Badge
              text={statusLabel[schedule.status]}
              variant={statusVariant[schedule.status]}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
