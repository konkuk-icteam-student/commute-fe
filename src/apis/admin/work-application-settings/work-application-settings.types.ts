export interface SaveWorkApplicationSettingsRequest {
  year: number;
  month: number;
  applyStartDate: string;
  applyEndDate: string;
  unavailableDates: string[];
  unavailableTimeRanges: {
    start: string;
    end: string;
  }[];
  maxConcurrentWorkers: number;
  minWorkUnitMinutes: number;
  weeklyMinMinutes: number;
  weeklyMaxMinutes: number;
  monthlyMinMinutes: number;
  monthlyMaxMinutes: number;
}

export interface SaveWorkApplicationSettingsResponse {
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
  unavailableTimeRanges: {
    start: string;
    end: string;
  }[];
  affectedScheduleCount: number;
  affectedUserCount: number;
}
