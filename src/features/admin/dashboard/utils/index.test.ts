import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DashboardAttendanceDetails } from "../types";

const { toDashboardMemberAttendanceRows } = (await import(
  new URL("./index.ts", import.meta.url).href
)) as typeof import("./index");

const baseAttendanceDetails: DashboardAttendanceDetails = {
  date: "2026-04-15",
  page: 0,
  size: 6,
  totalElements: 6,
  totalPages: 1,
  users: [
    {
      userId: "off-user",
      userName: "휴무자",
      department: "디자인학과",
      studentId: "202311306",
      workStatusCode: "OFF",
      lateCount: 0,
      lateMinutes: 0,
      weeklyWorkedMinutes: 0,
      weeklyLimitMinutes: 540,
      monthlyWorkedMinutes: 0,
      monthlyLimitMinutes: 1620,
    },
    {
      userId: "scheduled-user",
      userName: "예정자",
      department: "경영학부",
      studentId: "202311303",
      workStatusCode: "SCHEDULED",
      lateCount: 0,
      lateMinutes: 0,
      weeklyWorkedMinutes: 0,
      weeklyLimitMinutes: 540,
      monthlyWorkedMinutes: 300,
      monthlyLimitMinutes: 1620,
    },
    {
      userId: "completed-user",
      userName: "완료자",
      department: "전자공학부",
      studentId: "202311305",
      workStatusCode: "COMPLETED",
      lateCount: 1,
      lateMinutes: 5,
      weeklyWorkedMinutes: 300,
      weeklyLimitMinutes: 540,
      monthlyWorkedMinutes: 900,
      monthlyLimitMinutes: 1620,
    },
    {
      userId: "working-user",
      userName: "근무자",
      department: "컴퓨터공학부",
      studentId: "202311301",
      workStatusCode: "WORKING",
      lateCount: 1,
      lateMinutes: 8,
      weeklyWorkedMinutes: 270,
      weeklyLimitMinutes: 540,
      monthlyWorkedMinutes: 810,
      monthlyLimitMinutes: 1620,
    },
    {
      userId: "absent-user",
      userName: "결근자",
      department: "건축학부",
      studentId: "202311304",
      attendanceIssueCode: "ABSENT",
      workStatusCode: "WORKING",
      lateCount: 0,
      lateMinutes: 0,
      weeklyWorkedMinutes: 0,
      weeklyLimitMinutes: 540,
      monthlyWorkedMinutes: 0,
      monthlyLimitMinutes: 1620,
    },
    {
      userId: "not-checked-in-user",
      userName: "미출근자",
      department: "소프트웨어학부",
      studentId: "202311302",
      workStatusCode: "NOT_CHECKED_IN",
      lateCount: 0,
      lateMinutes: 0,
      weeklyWorkedMinutes: 0,
      weeklyLimitMinutes: 540,
      monthlyWorkedMinutes: 120,
      monthlyLimitMinutes: 1620,
    },
  ],
};

describe("toDashboardMemberAttendanceRows", () => {
  it("sorts members by dashboard attendance priority", () => {
    const rows = toDashboardMemberAttendanceRows(baseAttendanceDetails);

    assert.deepEqual(
      rows.map((row) => row.id),
      [
        "working-user",
        "not-checked-in-user",
        "scheduled-user",
        "absent-user",
        "completed-user",
        "off-user",
      ],
    );
  });

  it("keeps the source users array unchanged", () => {
    const originalUsers = structuredClone(baseAttendanceDetails.users);

    toDashboardMemberAttendanceRows(baseAttendanceDetails);

    assert.deepEqual(baseAttendanceDetails.users, originalUsers);
  });

  it("maps minute fields into display labels and progress values", () => {
    const [firstRow] = toDashboardMemberAttendanceRows(baseAttendanceDetails);

    assert.equal(firstRow.late, "1회 (8분)");
    assert.equal(firstRow.week, "4시간 30분 / 9시간 0분");
    assert.equal(firstRow.weekProgress, 50);
    assert.equal(firstRow.total, "13시간 30분 / 27시간 0분");
    assert.equal(firstRow.totalProgress, 50);
  });
});
