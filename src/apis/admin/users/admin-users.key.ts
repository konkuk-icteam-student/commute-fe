export const ADMIN_USERS_QUERY_KEY = {
  ALL: ["admin-users"],
  SEARCH: (keyword: string) => ["admin-users", "search", keyword],
} as const;
