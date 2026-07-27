export type RequestStatus = "idle" | "active" | "ended";

export interface WorkRequestTimeRange {
  start: string;
  end: string;
}

export interface WorkRequestFormValues {
  applyEndDate: string;
  applyStartDate: string;
  maxConcurrentWorkers: string;
  minWorkUnitMinutes: string;
  monthlyMaxMinutes: string;
  monthlyMinMinutes: string;
  unavailableDateInput: string;
  unavailableDates: string[];
  unavailableTimeRangeEndInput: string;
  unavailableTimeRangeStartInput: string;
  unavailableTimeRanges: WorkRequestTimeRange[];
  weeklyMaxMinutes: string;
  weeklyMinMinutes: string;
}

export type WorkRequestFieldChangeHandler = <
  Key extends keyof WorkRequestFormValues,
>(
  key: Key,
  value: WorkRequestFormValues[Key],
) => void;

export interface WorkRequestSettingsPayload {
  applyEndDate: string;
  applyStartDate: string;
  maxConcurrentWorkers: number;
  minWorkUnitMinutes: number;
  monthlyMaxMinutes: number;
  monthlyMinMinutes: number;
  unavailableDates?: string[];
  unavailableTimeRanges?: WorkRequestTimeRange[];
  weeklyMaxMinutes: number;
  weeklyMinMinutes: number;
}

export interface WorkRequestSettingsDetails extends WorkRequestSettingsPayload {
  affectedScheduleCount: number;
  affectedUserCount: number;
  month: number;
  year: number;
}

export interface WorkRequestSaveSuccessResponse {
  details: WorkRequestSettingsDetails;
  isSuccess: true;
  message: string;
}

export interface WorkRequestSaveErrorResponse {
  details: null;
  isSuccess: false;
  message: string;
}

export type WorkRequestSaveResult =
  | {
      data: WorkRequestSaveSuccessResponse;
      status: "success";
    }
  | {
      data: WorkRequestSaveErrorResponse;
      status: "error";
    };
