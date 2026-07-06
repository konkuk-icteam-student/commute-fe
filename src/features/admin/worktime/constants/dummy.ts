export const DUMMY_WORKTIME_EDIT_REQUEST = [
  {
    requestId: "9dc21a62-7d24-4411-9369-427d8e54cc2f",
    requestedAt: "2026-04-03T09:20:00",
    name: "작성자1",
    reason: "개인 일정으로 오후 근무를 오전으로 변경합니다.",
    deleteSlots: [
      {
        start: "2026-04-10T15:00:00",
        end: "2026-04-10T16:30:00",
      },
      {
        start: "2026-04-11T11:00:00",
        end: "2026-04-11T12:30:00",
      },
    ],
    addSlots: [
      {
        start: "2026-04-10T10:00:00",
        end: "2026-04-10T11:30:00",
      },
    ],
  },
  {
    requestId: "c76e05b4-cd1c-4c69-b51e-1c62e684b7aa",
    requestedAt: "2026-04-05T18:45:00",
    name: "작성자2",
    reason: "동아리 행사 참석으로 근무 시간을 변경합니다.",
    deleteSlots: [
      {
        start: "2026-04-13T09:00:00",
        end: "2026-04-13T10:30:00",
      },
    ],
    addSlots: [
      {
        start: "2026-04-13T16:00:00",
        end: "2026-04-13T17:30:00",
      },
    ],
  },
];
