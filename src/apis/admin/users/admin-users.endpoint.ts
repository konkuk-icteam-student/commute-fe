const BASE_URL = "/api/v1/admin/users" as const;

export const ADMIN_USERS_URL = {
  SEARCH: `${BASE_URL}/search`,
} as const;
