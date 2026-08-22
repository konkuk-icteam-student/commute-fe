import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { formatWorkRequestSummaryRequestedAt, getWorkRequestMonth } =
  (await import(
    new URL("./index.ts", import.meta.url).href
  )) as typeof import("./index");

describe("formatWorkRequestSummaryRequestedAt", () => {
  it("formats an ISO timestamp to yyyy.MM.dd HH:mm", () => {
    assert.equal(
      formatWorkRequestSummaryRequestedAt("2026-08-20T04:34:56"),
      "2026.08.20 04:34",
    );
  });

  it("formats a timestamp with seconds to yyyy.MM.dd HH:mm", () => {
    assert.equal(
      formatWorkRequestSummaryRequestedAt("2026-08-20 04:34:56"),
      "2026.08.20 04:34",
    );
  });

  it("keeps minute precision values in the requested display format", () => {
    assert.equal(
      formatWorkRequestSummaryRequestedAt("2026-08-20 04:34"),
      "2026.08.20 04:34",
    );
  });
});

describe("getWorkRequestMonth", () => {
  const today = new Date(2026, 7, 22);

  it("returns the offset month with its header label", () => {
    assert.deepEqual(getWorkRequestMonth(0, today), {
      label: "2026년 8월",
      month: 8,
      year: 2026,
    });
    assert.deepEqual(getWorkRequestMonth(1, today), {
      label: "2026년 9월",
      month: 9,
      year: 2026,
    });
    assert.deepEqual(getWorkRequestMonth(2, today), {
      label: "2026년 10월",
      month: 10,
      year: 2026,
    });
  });

  it("keeps counting across the year boundary", () => {
    assert.deepEqual(getWorkRequestMonth(2, new Date(2026, 10, 15)), {
      label: "2027년 1월",
      month: 1,
      year: 2027,
    });
    assert.deepEqual(getWorkRequestMonth(-1, new Date(2026, 0, 10)), {
      label: "2025년 12월",
      month: 12,
      year: 2025,
    });
  });
});
