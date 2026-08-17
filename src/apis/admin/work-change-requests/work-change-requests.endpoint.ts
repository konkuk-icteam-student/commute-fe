const BASE_URL = "/api/v1/admin/work-change-requests" as const;

export const ADMIN_WORK_CHANGE_REQUESTS_URL = {
  LIST: BASE_URL,
  DETAIL: (requestId: number) => `${BASE_URL}/${encodeURIComponent(requestId)}`,
  BULK: `${BASE_URL}/bulk`,
} as const;
