export interface WorkApplicationTimeRange {
  start: string;
  end: string;
}

export interface WorkApplicationSettings {
  year: number;
  month: number;
  applyStartDate: string;
  applyEndDate: string;
  maxConcurrentWorkers: number;
  minWorkUnitMinutes: number;
  weeklyMinMinutes: number;
  weeklyMaxMinutes: number;
  monthlyMinMinutes: number;
  monthlyMaxMinutes: number;
  unavailableDates: string[];
  unavailableTimeRanges: WorkApplicationTimeRange[];
}

export interface GetWorkApplicationSettingsRequest {
  year: number;
  month: number;
}

export interface ConfiguredWorkApplicationSettings
  extends WorkApplicationSettings {
  isConfigured: true;
  // 신청 시작일이 지났는지 등, 실제로 신청을 받고 있는지 여부
  applyStarted: boolean;
}

// 설정이 없으면 200 + isConfigured=false로 오고, 설정값은 전부 null이다.
// (목록형 두 필드만 빈 배열) 이쪽 값은 읽는 곳이 없어 판별에 쓰는 필드만 남긴다.
export type GetWorkApplicationSettingsResponse =
  | ConfiguredWorkApplicationSettings
  | {
      isConfigured: false;
      applyStarted: boolean;
      year: number;
      month: number;
    };

export type SaveWorkApplicationSettingsRequest = WorkApplicationSettings;

export interface SaveWorkApplicationSettingsResponse
  extends WorkApplicationSettings {
  affectedScheduleCount: number;
  affectedUserCount: number;
}
