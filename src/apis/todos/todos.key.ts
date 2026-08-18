export const TODOS_QUERY_KEY = {
  ALL: ["todos"],
  LIST: (date: string) => ["todos", "list", date],
} as const;
