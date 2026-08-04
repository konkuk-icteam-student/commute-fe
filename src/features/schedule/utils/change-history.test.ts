import assert from "node:assert/strict";
import { describe, it } from "node:test";

const { formatScheduleChangeHistorySlot } = (await import(
  new URL("./index.ts", import.meta.url).href
)) as typeof import("./index");

describe("formatScheduleChangeHistorySlot", () => {
  it("formats an ISO slot range with compact Korean date and hour text", () => {
    assert.equal(
      formatScheduleChangeHistorySlot({
        start: "2026-04-06T13:00:00",
        end: "2026-04-06T14:30:00",
        changeTypeCode: "CR02",
      }),
      "4월 6일 13:00-14:30 (1.5h)",
    );
  });
});
