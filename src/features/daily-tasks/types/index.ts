export type DailyTaskPeriod = "morning" | "afternoon";

export type DailyTaskItem = {
  id: number;
  title: string;
  completed: boolean;
};

export type WorkTimeWorker = {
  id: number;
  name: string;
  tone:
    | "student-blue"
    | "student-green"
    | "student-red"
    | "student-orange"
    | "student-cyan"
    | "student-pink"
    | "student-purple";
};

export type WorkTimeSlot = {
  time: string;
  workers: WorkTimeWorker[];
};

export type HandoverMemo = {
  id: number;
  author: string;
  createdAt: string;
  content: string;
};

export type DailyTasksByPeriod = Record<
  DailyTaskPeriod,
  {
    tasks: DailyTaskItem[];
    workTimeSlots: WorkTimeSlot[];
    handoverMemos: HandoverMemo[];
  }
>;
