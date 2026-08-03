"use client";

import { useEffect, useState } from "react";

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
import { mockNotificationSummary } from "@/features/notification";

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
  const {
    allowedRadiusMeters,
    canClockInAtWorkLocation,
    distanceFromWorkMeters,
    locationAccuracy,
    userLocation,
    workLocation,
  } = useClockInLocation();
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
  const timeOnlyAttendance = hasSchedules
    ? getAttendanceSummary(
        schedules,
        currentDate,
        clockedInScheduleId,
        clockedInAt,
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

  useEffect(() => {
    const disabledReasons: string[] = [];

    if (!hasSchedules) {
      disabledReasons.push("오늘 근무 일정 없음");
    }

    if (timeOnlyAttendance?.clockInScheduleId == null) {
      disabledReasons.push("출근 가능 시간 아님 또는 이미 출근 완료");
    }

    if (userLocation == null) {
      disabledReasons.push("사용자 위치 없음");
    } else if (!canClockInAtWorkLocation) {
      disabledReasons.push("근무 위치 50m 반경 밖");
    }

    console.info("[clock-in] 출근 버튼 상태", {
      enabled: attendance?.canClockIn ?? false,
      disabledReasons:
        disabledReasons.length > 0 ? disabledReasons : ["출근 가능"],
      currentTime: currentDate.toLocaleTimeString(),
      timeOnlyCanClockIn: timeOnlyAttendance?.canClockIn ?? false,
      timeOnlyClockInScheduleId: timeOnlyAttendance?.clockInScheduleId ?? null,
      finalClockInScheduleId: attendance?.clockInScheduleId ?? null,
      workLocation,
      userLocation,
      distanceFromWorkMeters:
        distanceFromWorkMeters == null
          ? null
          : Math.round(distanceFromWorkMeters * 10) / 10,
      locationAccuracyMeters: locationAccuracy,
      allowedRadiusMeters,
    });
  }, [
    allowedRadiusMeters,
    attendance,
    canClockInAtWorkLocation,
    currentDate,
    distanceFromWorkMeters,
    hasSchedules,
    locationAccuracy,
    timeOnlyAttendance,
    userLocation,
    workLocation,
  ]);

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
        newNotificationCount={
          mockNotificationSummary.details.newNotificationCount
        }
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
