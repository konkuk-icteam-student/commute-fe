export const DUMMY_WORKTIME_EDIT_REQUEST = [
  {
    requestId: "9dc21a62-7d24-4411-9369-427d8e54cc2f",
    requestedAt: "2026-04-03T09:20:00",
    name: "작성자1",
    reason: "개인 일정으로 오후 근무를 오전으로 변경합니다.",
    deleteSlots: [
      {
        date: "2026-06-15",
        start: "09:00",
        end: "11:00",
        changeTypeCode: "CR02",
      },
      {
        date: "2026-06-16",
        start: "15:00",
        end: "16:00",
        changeTypeCode: "CR02",
      },
    ],
    addSlots: [
      {
        date: "2026-06-17",
        start: "13:00",
        end: "15:00",
        changeTypeCode: "CR01",
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
        date: "2026-06-15",
        start: "09:00",
        end: "11:00",
        changeTypeCode: "CR02",
      },
    ],
    addSlots: [
      {
        date: "2026-06-17",
        start: "13:00",
        end: "15:00",
        changeTypeCode: "CR01",
      },
    ],
  },
];

export const DUMMY_WORKTIME_COMPLETE_EDIT_REQUEST = [
  {
    requestId: "c76e05b4-cd1c-4c69-b51e-1c62e684b7aa",
    requestedAt: "2026-04-05T18:45:00",
    name: "작성자2",
    reason: "동아리 행사 참석으로 근무 시간을 변경합니다.",
    deleteSlots: [
      {
        date: "2026-06-15",
        start: "09:00",
        end: "11:00",
        changeTypeCode: "CR02",
      },
    ],
    addSlots: [
      {
        date: "2026-06-17",
        start: "13:00",
        end: "15:00",
        changeTypeCode: "CR01",
      },
    ],
  },
];
