"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";

import { getTodosApi, updateTodoCompletionApi } from "./todos.api";
import { TODOS_QUERY_KEY } from "./todos.key";
import type {
  GetTodosRequest,
  GetTodosResponse,
  Todo,
  UpdateTodoCompletionRequest,
  UpdateTodoCompletionResponse,
} from "./todos.types";

const TODOS_CACHE_TIME = {
  LIST: {
    STALE: 1000 * 30,
    GC: 1000 * 60 * 5,
  },
} as const;

const applyCompletionToTodo = (
  todo: Todo,
  updatedTodo: UpdateTodoCompletionResponse["todo"],
): Todo =>
  todo.todoId === updatedTodo.todoId
    ? {
        ...todo,
        description: updatedTodo.description,
        timeSlot: updatedTodo.timeSlot,
        status: updatedTodo.status,
        completedByName: updatedTodo.completedByName,
        completedTime: updatedTodo.completedTime,
      }
    : todo;

export const useGetTodosQuery = ({
  date,
  enabled = true,
}: GetTodosRequest & { enabled?: boolean }) => {
  const {
    data: todosData,
    isPending: isPendingTodos,
    isFetching: isFetchingTodos,
    isError: isErrorTodos,
    error: todosError,
    refetch: refetchTodos,
  } = useQuery<GetTodosResponse, ApiError>({
    queryKey: TODOS_QUERY_KEY.LIST(date),
    queryFn: () => getTodosApi({ date }),
    enabled: enabled && date.length > 0,
    retry: 1,
    staleTime: TODOS_CACHE_TIME.LIST.STALE,
    gcTime: TODOS_CACHE_TIME.LIST.GC,
  });

  return {
    todosData,
    isPendingTodos,
    isFetchingTodos,
    isErrorTodos,
    todosError,
    refetchTodos,
  };
};

export const useUpdateTodoCompletionMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateTodoCompletion,
    isPending: isPendingUpdateTodoCompletion,
    variables,
  } = useMutation<
    UpdateTodoCompletionResponse,
    ApiError,
    UpdateTodoCompletionRequest
  >({
    mutationFn: updateTodoCompletionApi,
    onSuccess: ({ date, todo }) => {
      queryClient.setQueryData<GetTodosResponse>(
        TODOS_QUERY_KEY.LIST(date),
        (currentTodos) => {
          if (!currentTodos) {
            return currentTodos;
          }

          return {
            ...currentTodos,
            morningTodos: currentTodos.morningTodos.map((morningTodo) =>
              applyCompletionToTodo(morningTodo, todo),
            ),
            afternoonTodos: currentTodos.afternoonTodos.map((afternoonTodo) =>
              applyCompletionToTodo(afternoonTodo, todo),
            ),
          };
        },
      );
    },
  });

  return {
    updateTodoCompletion,
    isPendingUpdateTodoCompletion,
    pendingTodoCompletionId: isPendingUpdateTodoCompletion
      ? variables?.todoId
      : undefined,
  };
};
