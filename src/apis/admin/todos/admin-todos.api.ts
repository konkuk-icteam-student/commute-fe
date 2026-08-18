import { apiClient } from "@/apis/api-client";

import { ADMIN_TODOS_URL } from "./admin-todos.endpoint";
import type {
  CreateAdminTodoRequest,
  CreateAdminTodoResponse,
  DeleteAdminTodoRequest,
  UpdateAdminTodoRequest,
  UpdateAdminTodoResponse,
} from "./admin-todos.types";

export const createAdminTodoApi = async (body: CreateAdminTodoRequest) => {
  const response = await apiClient.post<
    CreateAdminTodoResponse,
    CreateAdminTodoRequest
  >(ADMIN_TODOS_URL.DEFAULT, body);

  return response.details;
};

export const updateAdminTodoApi = async ({
  todoId,
  ...body
}: UpdateAdminTodoRequest) => {
  const response = await apiClient.patch<
    UpdateAdminTodoResponse,
    Omit<UpdateAdminTodoRequest, "todoId">
  >(ADMIN_TODOS_URL.DETAIL(todoId), body);

  return response.details;
};

export const deleteAdminTodoApi = async ({ todoId }: DeleteAdminTodoRequest) => {
  await apiClient.delete<void>(ADMIN_TODOS_URL.DETAIL(todoId));
};
