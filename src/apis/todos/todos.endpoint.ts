const BASE_URL = "/api/v1/todos" as const;

export const TODOS_URL = {
  DEFAULT: BASE_URL,
  COMPLETION: (todoId: number) =>
    `${BASE_URL}/${encodeURIComponent(todoId)}/completion`,
} as const;
