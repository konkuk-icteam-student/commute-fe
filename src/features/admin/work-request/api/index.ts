import type {
  WorkRequestSaveResult,
  WorkRequestSettingsPayload,
} from "../types";

export async function saveWorkRequestSettings({
  month,
  payload,
  year,
}: {
  month: number;
  payload: WorkRequestSettingsPayload;
  year: number;
}): Promise<WorkRequestSaveResult> {
  // 실제 API 연동 시 이 함수 내부를 fetch(`/.../${year}/${month}`, ...)로 교체합니다.
  return {
    data: {
      details: {
        ...payload,
        affectedScheduleCount: 0,
        affectedUserCount: 0,
        month,
        year,
      },
      isSuccess: true,
      message: "근로신청 설정을 저장했습니다.",
    },
    status: "success",
  };
}
