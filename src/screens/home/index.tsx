"use client";

import { useEffect, useState } from "react";

import { useCheckInHomeMutation, useGetHomeTodayQuery } from "@/apis/home";
import { useGetNewNotificationsQuery } from "@/apis/notifications";
import {
  AttendanceCard,
  DateRefreshButton,
  formatCurrentDateTime,
  formatScheduleTime,
  getAttendanceSummary,
  HomeGreeting,
  HomeHeader,
  useClockInLocation,
  type WorkSchedule,
  type WorkScheduleStatus,
  WorkScheduleCard,
} from "@/features/home";

const mockHomeData = {
  userName: "홍길동",
  teamName: "정보운영팀",
};

const workStatusMap = {
  WK01: "scheduled",
  WK02: "working",
  WK03: "completed",
  WK04: "absent",
} as const satisfies Record<string, WorkScheduleStatus>;

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const { canClockInAtWorkLocation } = useClockInLocation();
  const { newNotificationsData } = useGetNewNotificationsQuery();
  const {
    homeTodayData,
    isErrorHomeToday,
    isPendingHomeToday,
    refetchHomeToday,
  } = useGetHomeTodayQuery();
  const { checkInHome, isPendingCheckInHome } = useCheckInHomeMutation();
  const currentDateTime = formatCurrentDateTime(currentDate);
  const schedules: WorkSchedule[] =
    homeTodayData?.schedules.map((schedule) => ({
      id: schedule.scheduleIds.join("-"),
      scheduleIds: schedule.scheduleIds,
      title: schedule.label,
      time: `${formatScheduleTime(schedule.start)} - ${formatScheduleTime(
        schedule.end,
      )}`,
      status: workStatusMap[schedule.workStatusCode],
      checkedIn: schedule.checkedIn,
      checkInTime: schedule.checkInTime,
    })) ?? [];
  const hasSchedules = schedules.length > 0;
  const attendance = hasSchedules
    ? getAttendanceSummary(schedules, currentDate, { canClockInAtWorkLocation })
    : null;
  const attendanceForCard = attendance
    ? {
        ...attendance,
        canClockIn: attendance.canClockIn && !isPendingCheckInHome,
      }
    : null;
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 30_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const refreshCurrentDateTime = () => {
    setCurrentDate(new Date());
    refetchHomeToday();
  };

  const clockIn = () => {
    if (
      !attendance?.clockInScheduleIds ||
      !canClockInAtWorkLocation ||
      isPendingCheckInHome
    ) {
      return;
    }

    checkInHome(
      { scheduleIds: attendance.clockInScheduleIds },
      {
        onSuccess: () => {
          setCurrentDate(new Date());
        },
      },
    );
  };

  return (
    <section className="min-h-full w-full bg-white px-6.5 pt-14.5 pb-28 text-[#111827]">
      <HomeHeader
        newNotificationCount={newNotificationsData?.newNotificationCount ?? 0}
      />
      <HomeGreeting
        teamName={mockHomeData.teamName}
        userName={mockHomeData.userName}
      />
      <DateRefreshButton
        currentDateTime={currentDateTime}
        onRefresh={refreshCurrentDateTime}
      />
      {isPendingHomeToday && (
        <div className="mt-5 rounded-[20px] border border-[#DDE3EF] px-4 py-8 text-center text-[12px] font-bold text-[#8892A6]">
          오늘의 근무 현황을 불러오는 중입니다.
        </div>
      )}
      {isErrorHomeToday && (
        <div className="mt-5 rounded-[20px] border border-[#DDE3EF] px-4 py-8 text-center text-[12px] font-bold text-[#8892A6]">
          오늘의 근무 현황을 불러오지 못했습니다.
        </div>
      )}
      {!isPendingHomeToday && !isErrorHomeToday && attendanceForCard && (
        <AttendanceCard attendance={attendanceForCard} onClockIn={clockIn} />
      )}
      {!isPendingHomeToday && !isErrorHomeToday && (
        <WorkScheduleCard schedules={schedules} />
      )}
    </section>
  );
}
