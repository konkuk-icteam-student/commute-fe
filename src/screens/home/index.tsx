"use client";

import { useEffect, useState } from "react";

import {
  AttendanceCard,
  DateRefreshButton,
  HomeGreeting,
  HomeHeader,
  WorkScheduleCard,
  formatCurrentDateTime,
  getAttendanceSummary,
  syncSchedulesWithCurrentTime,
} from "@/features/home";

const mockHomeData = {
  unreadNotificationCount: 3,
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
      time: "13:30 - 15:30",
    },
  ],
};

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [clockedInScheduleId, setClockedInScheduleId] = useState<number | null>(
    null,
  );
  const [clockedInAt, setClockedInAt] = useState<Date | null>(null);
  const currentDateTime = formatCurrentDateTime(currentDate);
  const schedules = syncSchedulesWithCurrentTime(
    mockHomeData.schedules,
    currentDate,
    clockedInScheduleId,
  );
  const attendance = getAttendanceSummary(
    schedules,
    currentDate,
    clockedInScheduleId,
    clockedInAt,
  );

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
    if (attendance.clockInScheduleId == null) {
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
        unreadNotificationCount={mockHomeData.unreadNotificationCount}
      />
      <HomeGreeting
        teamName={mockHomeData.teamName}
        userName={mockHomeData.userName}
      />
      <DateRefreshButton
        currentDateTime={currentDateTime}
        onRefresh={refreshCurrentDateTime}
      />
      <AttendanceCard attendance={attendance} onClockIn={clockIn} />
      <WorkScheduleCard schedules={schedules} />
    </section>
  );
}
