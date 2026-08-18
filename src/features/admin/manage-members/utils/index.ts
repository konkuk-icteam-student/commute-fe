// 서버는 근무·한도 시간을 분으로 준다. 30분 단위 근무라 소수점이 남을 수 있어
// 나누어떨어지면 정수로, 아니면 소수 첫째 자리까지만 보여 준다. 예: 240 -> "4", 270 -> "4.5"
// 아직 채우지 않은 정보는 null로 온다. 빈칸으로 두면 표가 밀려 보여 자리를 채운다.
export const EMPTY_MEMBER_TEXT = "-";

export function formatGrade(grade: number | null) {
  return grade === null ? EMPTY_MEMBER_TEXT : `${grade}학년`;
}

export function formatMinutesToHours(minutes: number) {
  const hours = minutes / 60;

  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}
