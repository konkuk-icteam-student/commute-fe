import Image from "next/image";

import attendanceCompleteIcon from "@/assets/icons/attendance-complete-icon.svg";
import attendancePendingIcon from "@/assets/icons/attendance-pending-icon.svg";

export type AttendanceStatus = "completed" | "scheduled";

export type AttendanceSummary = {
  status: AttendanceStatus;
  title: string;
  highlightTime?: string;
  description: string;
  buttonText: string;
  canClockIn: boolean;
  clockInScheduleId?: number;
};

const attendanceIcon = {
  completed: attendanceCompleteIcon,
  scheduled: attendancePendingIcon,
};

type AttendanceCardProps = {
  attendance: AttendanceSummary;
  onClockIn: () => void;
};

export default function AttendanceCard({
  attendance,
  onClockIn,
}: AttendanceCardProps) {
  const canClockIn = attendance.canClockIn;

  return (
    <div className="mt-5 h-22.25 w-[86vw] max-w-full rounded-[20px] border border-[#DDE3EF] py-5.75 pr-4 pl-5.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10.75 w-10.75 shrink-0 items-center justify-center rounded-[14px] bg-[#DDEAFF] text-[#236AF2]">
            <Image
              alt=""
              aria-hidden="true"
              src={attendanceIcon[attendance.status]}
              width={22}
              height={22}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] leading-5 font-bold text-[#1A2236]">
              {attendance.title}
            </p>
            <p className="mt-1 text-[12px] leading-5 font-bold text-[#8892A6]">
              {attendance.highlightTime ? (
                <>
                  <span className="text-[#1D4ED8]">
                    {attendance.highlightTime}
                  </span>
                  <span className="font-medium"> {attendance.description}</span>
                </>
              ) : (
                <span className="font-medium">{attendance.description}</span>
              )}
            </p>
          </div>
        </div>

        <button
          className={`h-10.5 w-18.25 shrink-0 cursor-pointer rounded-xl text-[13px] leading-5 font-bold text-white disabled:cursor-default ${
            canClockIn ? "bg-[#2076FF]" : "bg-[#C5CBD6]"
          }`}
          disabled={!canClockIn}
          onClick={onClockIn}
          type="button"
        >
          {attendance.buttonText}
        </button>
      </div>
    </div>
  );
}
