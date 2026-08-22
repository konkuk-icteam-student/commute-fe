import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isWithinApplyPeriod } from "./index";

describe("isWithinApplyPeriod", () => {
  const period = { applyStartDate: "2026-08-01", applyEndDate: "2026-08-10" };

  it("기간 안이면 참이다", () => {
    assert.equal(isWithinApplyPeriod("2026-08-05", period), true);
  });

  it("시작일과 종료일 당일도 기간에 포함한다", () => {
    assert.equal(isWithinApplyPeriod("2026-08-01", period), true);
    assert.equal(isWithinApplyPeriod("2026-08-10", period), true);
  });

  it("기간 밖이면 거짓이다", () => {
    assert.equal(isWithinApplyPeriod("2026-07-31", period), false);
    assert.equal(isWithinApplyPeriod("2026-08-11", period), false);
  });

  it("기간이 설정되지 않았으면 기간 밖으로 본다", () => {
    assert.equal(isWithinApplyPeriod("2026-08-05", undefined), false);
    assert.equal(
      isWithinApplyPeriod("2026-08-05", {
        applyStartDate: null,
        applyEndDate: null,
      }),
      false,
    );
  });
});
