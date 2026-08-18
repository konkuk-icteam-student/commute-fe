const BASE_URL = "/api/v1/admin/todos" as const;

export const ADMIN_TODOS_URL = {
  DEFAULT: BASE_URL,
  DETAIL: (todoId: number) => `${BASE_URL}/${encodeURIComponent(todoId)}`,
} as const;
