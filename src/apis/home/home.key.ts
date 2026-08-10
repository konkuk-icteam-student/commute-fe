export const HOME_QUERY_KEY = {
  ALL: ["home"],
  TODAY: ["home", "today"],
} as const;

type HomeQueryClient = {
  invalidateQueries: (filters: { queryKey: typeof HOME_QUERY_KEY.ALL }) => unknown;
};

export const invalidateHomeQueries = (queryClient: HomeQueryClient) =>
  queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY.ALL });
