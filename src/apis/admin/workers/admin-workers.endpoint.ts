const BASE_URL = "/api/v1/admin/workers" as const;

export const ADMIN_WORKERS_URL = {
  LIST: BASE_URL,
  DETAIL: (userId: number) => `${BASE_URL}/${encodeURIComponent(userId)}`,
} as const;
