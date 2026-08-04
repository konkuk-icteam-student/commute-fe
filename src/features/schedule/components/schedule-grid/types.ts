import type {
  ScheduleRequestEditStatus,
  ScheduleSlotStatus,
} from "../../types";
import type { SlotKey } from "../../model/slot-key";

// 계산이 모두 끝난 칸 하나. 표는 이 값을 그대로 그리기만 한다.
export interface ScheduleCell {
  key: SlotKey;
  status: ScheduleSlotStatus;
  // 원래 색 위에 덧칠할 요청 상태. 수정 요청 화면에서만 채워진다.
  requestStatus?: ScheduleRequestEditStatus;
  // 글자색 예외. 없으면 표의 기본 규칙을 따른다.
  textClassName?: string;
  count: number;
  maxCount: number;
  disabled: boolean;
  showCount: boolean;
  // 표 왼쪽에 붙일 시간 라벨(9, 10 ...). 첫 번째 요일의 정시 칸에만 있다.
  hourMark?: number;
  onClick: () => void;
}
