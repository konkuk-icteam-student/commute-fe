"use client";

import { useEffect, useState } from "react";

import { useGetNewNotificationsQuery } from "@/apis/notifications";
import {
  AttendanceCard,
  DateRefreshButton,
  formatCurrentDateTime,
  getAttendanceSummary,
  HomeGreeting,
  HomeHeader,
  syncSchedulesWithCurrentTime,
  useClockInLocation,
  WorkScheduleCard,
} from "@/features/home";

const mockHomeData = {
  userName: "홍길동",
  teamName: "정보운영팀",
  schedules: [
    {
      id: 1,
      title: "오전 근무",
      time: "09:30 - 11:30",
    },
    {
      id: 2,
      title: "오후 근무",
      time: "13:30 - 16:30",
    },
  ],
};

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [clockedInScheduleId, setClockedInScheduleId] = useState<number | null>(
    null,
  );
  const [clockedInAt, setClockedInAt] = useState<Date | null>(null);
  const { canClockInAtWorkLocation } = useClockInLocation();
  const { newNotificationsData } = useGetNewNotificationsQuery();
  const currentDateTime = formatCurrentDateTime(currentDate);
  const schedules = syncSchedulesWithCurrentTime(
    mockHomeData.schedules,
    currentDate,
    clockedInScheduleId,
  );
  const hasSchedules = schedules.length > 0;
  const attendance = hasSchedules
    ? getAttendanceSummary(
        schedules,
        currentDate,
        clockedInScheduleId,
        clockedInAt,
        { canClockInAtWorkLocation },
      )
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
  };

  const clockIn = () => {
    if (attendance?.clockInScheduleId == null || !canClockInAtWorkLocation) {
      return;
    }

    const now = new Date();

    setClockedInScheduleId(attendance.clockInScheduleId);
    setClockedInAt(now);
    setCurrentDate(now);
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
      {attendance && (
        <AttendanceCard attendance={attendance} onClockIn={clockIn} />
      )}
      <WorkScheduleCard schedules={schedules} />
    </section>
  );
}
