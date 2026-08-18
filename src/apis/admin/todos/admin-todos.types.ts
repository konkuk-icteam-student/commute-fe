export type AdminTodoStatus = "PENDING" | "COMPLETED";

export interface CreateAdminTodoRequest {
  date: string;
  timeSlot: string;
  description: string;
}

export interface CreateAdminTodoResponse {
  todoId: number;
  date: string;
  timeSlot: string;
  description: string;
  status: AdminTodoStatus;
  completed: boolean;
  createdAt: string;
}

export interface UpdateAdminTodoRequest {
  todoId: number;
  date?: string;
  timeSlot?: string;
  description?: string;
}

export interface UpdateAdminTodoResponse {
  todoId: number;
  date: string;
  timeSlot: string;
  description: string;
  status: AdminTodoStatus;
  completed: boolean;
  updatedAt: string;
}

export interface DeleteAdminTodoRequest {
  todoId: number;
}
