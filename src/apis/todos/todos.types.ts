export type TodoStatus = "PENDING" | "COMPLETED";

export interface GetTodosRequest {
  date: string;
}

export interface TodoCreatedBy {
  userId: string;
  userName: string;
  department: string | null;
  studentId: string | null;
}

export interface Todo {
  todoId: number;
  description: string;
  timeSlot: string;
  status: TodoStatus;
  createdBy?: TodoCreatedBy;
  createdAt: string;
  completedByName?: string | null;
  completedTime?: string | null;
}

export interface GetTodosResponse {
  date: string;
  morningTodos: Todo[];
  afternoonTodos: Todo[];
}

export interface UpdateTodoCompletionRequest {
  date: string;
  todoId: number;
  isCompleted: boolean;
}

export interface UpdateTodoCompletionResponseTodo {
  todoId: number;
  description: string;
  timeSlot: string;
  status: TodoStatus;
  completedByName: string | null;
  completedTime: string | null;
}

export interface UpdateTodoCompletionResponseSummary {
  completedCount: number;
  totalCount: number;
}

export interface UpdateTodoCompletionResponse {
  date: string;
  todo: UpdateTodoCompletionResponseTodo;
  summary: UpdateTodoCompletionResponseSummary;
}
