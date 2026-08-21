import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getNextYearMonth, isWithinApplyPeriod } from "./index";

describe("getNextYearMonth", () => {
  it("같은 해 안에서는 월만 하나 올린다", () => {
    assert.deepEqual(getNextYearMonth(2026, 8), { year: 2026, month: 9 });
  });

  it("12월이면 다음 해 1월이 된다", () => {
    assert.deepEqual(getNextYearMonth(2026, 12), { year: 2027, month: 1 });
  });
});

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
