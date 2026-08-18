const BASE_URL = "/api/v1/handover-memos" as const;

export const HANDOVER_MEMOS_URL = {
  DEFAULT: BASE_URL,
  DETAIL: (memoId: number) => `${BASE_URL}/${encodeURIComponent(memoId)}`,
} as const;
