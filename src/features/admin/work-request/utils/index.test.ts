import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { formatWorkRequestSummaryRequestedAt } = (await import(
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
