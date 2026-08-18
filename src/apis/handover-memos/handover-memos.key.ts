export const HANDOVER_MEMOS_QUERY_KEY = {
  ALL: ["handover-memos"],
  LIST: (date: string) => ["handover-memos", "list", date],
} as const;
