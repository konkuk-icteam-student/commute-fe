import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatNotificationContent,
  formatNotificationCreatedAt,
} from "./index";

describe("formatNotificationContent", () => {
  it("formats a structured notification time item", () => {
    assert.equal(
      formatNotificationContent({
        date: "2026-04-06",
        startTime: "13:00",
        endTime: "13:30",
        durationMinutes: 30,
        changeTypeCode: "CR01",
      }),
      "4월 6일 13:00-13:30 (0.5h)",
    );
  });

  it("converts minutes longer than an hour", () => {
    assert.equal(
      formatNotificationContent({
        date: "2026-04-09",
        startTime: "13:00",
        endTime: "14:30",
        durationMinutes: 90,
        changeTypeCode: "CR02",
      }),
      "4월 9일 13:00-14:30 (1.5h)",
    );
  });
});

describe("formatNotificationCreatedAt", () => {
  it("formats an ISO timestamp with dot-separated date", () => {
    assert.equal(
      formatNotificationCreatedAt("2026-03-20T16:21:00"),
      "2026.03.20 16:21",
    );
  });
});
