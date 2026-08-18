import type { BadgeVariant } from "@/components/ui/badge";

export type ManageTaskStudent = {
  tone: Extract<BadgeVariant, `student-${string}`>;
  name: string;
};

export type ManageTaskScheduleItem = {
  students: ManageTaskStudent[];
  time: string;
};

export type ManageTaskScheduleGroup = {
  items: ManageTaskScheduleItem[];
  title: string;
};

export type ManageTaskItem = {
  assignee?: string;
  completed: boolean;
  completedAt?: string;
  id: number;
  period: "오전" | "오후";
  title: string;
};

export type ManageTaskMemo = {
  author: string;
  content: string;
  createdAt: string;
  id: number;
  isMine: boolean;
};
