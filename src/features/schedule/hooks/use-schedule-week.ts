import { useState } from "react";

import { getMonthWeekOfDate } from "@/lib/date-formatter";

// 기준 날짜가 속한 달 안에서 주차를 오간다.
// 조회·수정 요청 화면은 오늘을, 근로 신청 화면은 다음 달 1일을 기준으로 넘긴다.
export const useScheduleWeek = (baseDate: Date) => {
  const {
    year,
    month,
    week: initialWeek,
    maxWeek,
  } = getMonthWeekOfDate(baseDate);
  const [week, setWeek] = useState(initialWeek);

  const goPrevWeek = () => {
    setWeek((currentWeek) => Math.max(1, currentWeek - 1));
  };

  const goNextWeek = () => {
    setWeek((currentWeek) => Math.min(maxWeek, currentWeek + 1));
  };

  return {
    year,
    month,
    week,
    maxWeek,
    isPrevWeekDisabled: week <= 1,
    isNextWeekDisabled: week >= maxWeek,
    goPrevWeek,
    goNextWeek,
  };
};
