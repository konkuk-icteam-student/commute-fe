import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatTimeLabel,
  parseCheckInTimeToMinutes,
  parseTimeToMinutes,
} from "./schedule-time";

describe("home schedule time utils", () => {
  it("parses HH:mm and HH:mm:ss times", () => {
    assert.equal(parseTimeToMinutes("09:02"), 542);
    assert.equal(parseTimeToMinutes("09:02:00"), 542);
  });

  it("parses ISO datetime check-in values", () => {
    assert.equal(parseCheckInTimeToMinutes("2026-10-13T09:02:00"), 542);
  });

  it("keeps check-in time labels in AM/PM format", () => {
    assert.equal(formatTimeLabel(542), "AM 9:02");
  });
});
