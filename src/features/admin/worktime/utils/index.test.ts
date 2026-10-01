import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toMaxConcurrentWorkersByDate } from "./max-concurrent-workers";

describe("toMaxConcurrentWorkersByDate", () => {
  it("keeps each month's limit on a week that crosses a month boundary", () => {
    const result = toMaxConcurrentWorkersByDate(
      {
        maxConcurrentWorkers: 4,
        days: [{ date: "2026-09-30" }],
      },
      {
        maxConcurrentWorkers: 5,
        days: [{ date: "2026-10-01" }, { date: "2026-10-02" }],
      },
    );

    assert.deepEqual(result, {
      "2026-09-30": 4,
      "2026-10-01": 5,
      "2026-10-02": 5,
    });
  });
});
