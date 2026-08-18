import { apiClient } from "@/apis/api-client";

import { TODOS_URL } from "./todos.endpoint";
import type {
  GetTodosRequest,
  GetTodosResponse,
  UpdateTodoCompletionRequest,
  UpdateTodoCompletionResponse,
} from "./todos.types";

export const getTodosApi = async ({ date }: GetTodosRequest) => {
  const response = await apiClient.get<GetTodosResponse>(TODOS_URL.DEFAULT, {
    params: { date },
  });

  return response.details;
};

export const updateTodoCompletionApi = async ({
  todoId,
  isCompleted,
}: UpdateTodoCompletionRequest) => {
  const response = await apiClient.patch<
    UpdateTodoCompletionResponse,
    Pick<UpdateTodoCompletionRequest, "isCompleted">
  >(TODOS_URL.COMPLETION(todoId), { isCompleted });

  return response.details;
};
