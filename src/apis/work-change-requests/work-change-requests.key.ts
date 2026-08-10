import type { WorkChangeRequestHistoryParams } from "./work-change-requests.types";

const normalizeHistoryParams = ({
  year,
  month,
  statusCode = "ALL",
  page = 0,
  size = 10,
}: WorkChangeRequestHistoryParams) => ({
  year,
  month,
  statusCode,
  page,
  size,
});

export const WORK_CHANGE_REQUESTS_QUERY_KEY = {
  ALL: ["work-change-requests"],
  HISTORY: (params: WorkChangeRequestHistoryParams) => [
    "work-change-requests",
    "history",
    normalizeHistoryParams(params),
  ],
} as const;
