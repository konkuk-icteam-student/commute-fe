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
  {
    requestId: "9dc21a62-7d24-4411-9369-427d8e54qrcc2f",
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
    requestId: "c76e05b4-cd1c-4c69-b51e-1c62e684b7aaqwe",
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

export const DUMMY_WORKTIME_QUICK_SEARCH_RESULT = [
  { id: 1, date: "2026-06-15", start: "09:00", end: "11:00" },
  { id: 2, date: "2026-06-17", start: "13:00", end: "15:00" },
  { id: 3, date: "2026-06-20", start: "13:00", end: "15:00" },
];

const timeSlots = [
  ["09:00", "09:30"],
  ["09:30", "10:00"],
  ["10:00", "10:30"],
  ["10:30", "11:00"],
  ["11:00", "11:30"],
  ["11:30", "12:00"],
  ["12:00", "12:30"],
  ["12:30", "13:00"],
  ["13:00", "13:30"],
  ["13:30", "14:00"],
  ["14:00", "14:30"],
  ["14:30", "15:00"],
  ["15:00", "15:30"],
  ["15:30", "16:00"],
  ["16:00", "16:30"],
  ["16:30", "17:00"],
  ["17:00", "17:30"],
];

const disabledStarts = ["11:30", "12:00", "12:30"];
const studentNumbers = [1, 2, 3, 4, 5, 6];

function createSeededRandom(seedValue: string) {
  let seed = Array.from(seedValue).reduce(
    (hash, character) => (hash * 31 + (character.codePointAt(0) ?? 0)) >>> 0,
    0,
  );

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function getRandomStudentNumbers(count: number, random: () => number) {
  const shuffledStudentNumbers = [...studentNumbers];

  for (let index = shuffledStudentNumbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));

    [shuffledStudentNumbers[index], shuffledStudentNumbers[randomIndex]] = [
      shuffledStudentNumbers[randomIndex],
      shuffledStudentNumbers[index],
    ];
  }

  return shuffledStudentNumbers.slice(0, count);
}

function generateDailySlots(date: string) {
  return timeSlots.map(([start, end]) => {
    const isUnavailable = disabledStarts.includes(start);

    if (isUnavailable) {
      return {
        date,
        start,
        end,
        currentCount: 0,
        isOverLimit: false,
        isUnavailable: true,
        users: [],
      };
    }

    const random = createSeededRandom(`${date}-${start}`);
    const currentCount = Math.floor(random() * 5);
    const selectedStudentNumbers = getRandomStudentNumbers(
      currentCount,
      random,
    );

    return {
      date,
      start,
      end,
      currentCount,
      isOverLimit: false,
      isUnavailable: false,
      users: selectedStudentNumbers.map((studentNumber) => ({
        userId: `${date}-${start}-user-${studentNumber}`,
        userName: `학생${studentNumber}`,
      })),
    };
  });
}

export const DUMMY_WORKTIME_DETAIL_SCHEDULE = {
  details: {
    startDate: "2026-07-13",
    endDate: "2026-07-17",
    maxConcurrentWorkers: 4,
    slots: [
      generateDailySlots("2026-07-13"),
      generateDailySlots("2026-07-14"),
      generateDailySlots("2026-07-15"),
      generateDailySlots("2026-07-16"),
      generateDailySlots("2026-07-17"),
    ],
  },
};

export const DUMMY_WORKTIME_DETAIL_SEARCH_TO_ADD = [
  {
    userId: 1,
    name: "홍길동",
  },
  {
    userId: 2,
    name: "철수",
  },
  {
    userId: 3,
    name: "영희",
  },
];
