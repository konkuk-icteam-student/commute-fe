interface WorkSchedulesWithLimit {
  maxConcurrentWorkers: number;
  days: { date: string }[];
}

export function toMaxConcurrentWorkersByDate(
  ...responses: (WorkSchedulesWithLimit | undefined)[]
) {
  return Object.fromEntries(
    responses.flatMap((response) =>
      (response?.days ?? []).map(({ date }) => [
        date,
        response?.maxConcurrentWorkers ?? 0,
      ]),
    ),
  );
}
