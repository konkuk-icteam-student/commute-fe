export const NOTIFICATIONS_QUERY_KEY = {
  ALL: ["notifications"],
  LIST: ["notifications", "list"],
  NEW: ["notifications", "new"],
} as const;

type NotificationsQueryClient = {
  invalidateQueries: (filters: {
    queryKey: typeof NOTIFICATIONS_QUERY_KEY.ALL;
  }) => unknown;
};

export const invalidateNotificationsQueries = (
  queryClient: NotificationsQueryClient,
) =>
  queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY.ALL });
