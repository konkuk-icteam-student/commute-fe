import type { AdminSearchedUser } from "@/apis/admin/users";
import type { GetAdminWorkChangeRequestsResponse } from "@/apis/admin/work-change-requests";
import type { AdminWorkScheduleQuickSearchSlot } from "@/apis/admin/work-schedules";
import type { GetAdminWorkSchedulesResponse } from "@/apis/work-schedules";
import {
  EMPTY_SCHEDULE,
  SLOT_TIMES,
  type WeekScheduleSource,
  type Weekday,
} from "@/features/schedule";

import type {
  WorktimeDetailTableCellType,
  WorktimeEditRequestItemType,
} from "../types";

// 검색 결과에 붙이는 부가 정보. 학과·학번은 없을 수 있어 자리를 비우지 않고 표시한다.
export function formatAdminUserDetail({
  department,
  studentId,
}: AdminSearchedUser) {
  return [department ?? "학과 미설정", studentId ?? "학번 미설정"].join(" | ");
}

export interface WorktimeType {
  date: string;
  start: string;
  end: string;
}

// 관리자 표는 배정 인원 수만 보여 주므로 AVAILABLE은 빈 칸과 같게 그린다.
// 사용자 시간표의 상태 값(MY_SCHEDULE 등)은 관리자 응답에 오지 않는다.
export function toAdminWeekScheduleSource(
  response?: GetAdminWorkSchedulesResponse,
): WeekScheduleSource {
  if (!response) {
    return EMPTY_SCHEDULE;
  }

  return {
    maxConcurrentWorkers: response.maxConcurrentWorkers,
    days: response.days.map(({ date, slots }) => ({
      date,
      slots: slots.map(({ start, end, status, currentCount }) => ({
        start,
        end,
        currentCount,
        status: status === "AVAILABLE" ? "EMPTY" : status,
      })),
    })),
  };
}

// 자세히 보기 표는 인원 목록과 초과 여부까지 쓴다.
// 응답이 며칠치만 오더라도 표 모양이 흔들리지 않도록 날짜로 맞춰 채운다.
export function toWorktimeDetailSlotsByDay(
  weekdays: Weekday[],
  response?: GetAdminWorkSchedulesResponse,
): WorktimeDetailTableCellType[][] {
  return weekdays.map(({ date }) => {
    const day = response?.days.find((responseDay) => responseDay.date === date);
    const slotsByStart = new Map(day?.slots.map((slot) => [slot.start, slot]));

    return SLOT_TIMES.map(({ start, end }) => {
      const slot = slotsByStart.get(start);

      // 응답에 없는 칸은 잠긴 것으로 본다. 열려 보이는 것보다 안전하다.
      return {
        date,
        start,
        end,
        currentCount: slot?.currentCount ?? 0,
        isOverLimit: slot?.isOverLimit ?? false,
        isUnavailable: !slot || slot.status === "UNAVAILABLE",
        users: slot?.users ?? [],
      };
    });
  });
}

function formatMonthDay(date: string) {
  const [, month, day] = date.split("-");

  return `${Number(month)}월 ${Number(day)}일`;
}

function getMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

function formatDurationHour(start: string, end: string) {
  const durationHour = (getMinutes(end) - getMinutes(start)) / 60;

  return String(durationHour);
}

// ISO datetime 문자열을 9월 13일 13:45 형식으로 포맷
export function formatWorktimeRequestDateTime(dateTime: string) {
  const [date, time] = dateTime.split("T");

  return `${formatMonthDay(date)} ${time.slice(0, 5)}`;
}

// WorktimeType 의 객체를 4월 6일 13:00-14:30 (0.5h) 형식으로 포맷
export function formatWorktimeRequestSlot({ date, start, end }: WorktimeType) {
  return `${formatMonthDay(date)} ${start}-${end} (${formatDurationHour(start, end)}h)`;
}

export function toWorktimeEditRequestItems(
  details: GetAdminWorkChangeRequestsResponse,
): WorktimeEditRequestItemType[] {
  return details.requests.map((request) => ({
    requestId: request.requestId,
    requestedAt: request.requestedAt,
    name: request.userName,
    deleteSlots: request.deleteSchedules,
    addSlots: request.addSchedules,
    reason: request.reason,
    statusCode: request.statusCode,
    rejectReason: request.rejectReason,
  }));
}

// 빠른 찾기 결과 한 줄. 예: 4.10 (금) 09:30 ~ 11:30
// 날짜 표기는 시간표 상단과 같은 M.DD 규칙을 따른다.
export function formatWorktimeQuickSearchSlot({
  date,
  dayOfWeek,
  start,
  end,
}: AdminWorkScheduleQuickSearchSlot & { date: string; dayOfWeek: string }) {
  const [, month, day] = date.split("-");

  return `${Number(month)}.${day} (${dayOfWeek}) ${start} ~ ${end}`;
}
