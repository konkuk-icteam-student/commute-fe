import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  invalidateNotificationsQueries,
  NOTIFICATIONS_QUERY_KEY,
} from "@/apis/notifications/notifications.key";

describe("invalidateNotificationsQueries", () => {
  it("invalidates every notifications query with the shared parent key", () => {
    const calls: unknown[] = [];

    invalidateNotificationsQueries({
      invalidateQueries: (filters) => {
        calls.push(filters);
      },
    });

    assert.deepEqual(calls, [
      {
        queryKey: NOTIFICATIONS_QUERY_KEY.ALL,
      },
    ]);
  });
});
