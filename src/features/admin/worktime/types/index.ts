// TODO: 추후 api 연동 시 정리

export interface WorktimeChangeRequestType {
  date: string;
  start: string;
  end: string;
  changeTypeCode: string;
}

export interface WorktimeDetailTableCellType {
  date: string;
  start: string;
  end: string;
  currentCount: number;
  isOverLimit: boolean;
  isUnavailable: boolean;
  users: {
    userId: string;
    userName: string;
  }[];
}
