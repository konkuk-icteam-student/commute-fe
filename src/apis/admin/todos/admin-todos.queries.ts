"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ApiError } from "@/apis/api-client";
import { TODOS_QUERY_KEY } from "@/apis/todos/todos.key";
import type { GetTodosResponse, Todo } from "@/apis/todos/todos.types";

import {
  createAdminTodoApi,
  deleteAdminTodoApi,
  updateAdminTodoApi,
} from "./admin-todos.api";
import type {
  CreateAdminTodoRequest,
  CreateAdminTodoResponse,
  DeleteAdminTodoRequest,
  UpdateAdminTodoRequest,
  UpdateAdminTodoResponse,
} from "./admin-todos.types";

const getTodoPeriod = (timeSlot: string) => {
  const hour = Number(timeSlot.split(":")[0]);

  return hour < 12 ? "morning" : "afternoon";
};

const removeTodoFromList = (
  todos: GetTodosResponse,
  todoId: number,
): GetTodosResponse => ({
  ...todos,
  morningTodos: todos.morningTodos.filter((todo) => todo.todoId !== todoId),
  afternoonTodos: todos.afternoonTodos.filter((todo) => todo.todoId !== todoId),
});

const appendTodoToPeriod = (
  todos: GetTodosResponse,
  todo: Todo,
): GetTodosResponse => {
  const period = getTodoPeriod(todo.timeSlot);

  return {
    ...todos,
    morningTodos:
      period === "morning" ? [...todos.morningTodos, todo] : todos.morningTodos,
    afternoonTodos:
      period === "afternoon"
        ? [...todos.afternoonTodos, todo]
        : todos.afternoonTodos,
  };
};

const toTodoFromCreateResponse = (
  createdTodo: CreateAdminTodoResponse,
): Todo => ({
  todoId: createdTodo.todoId,
  description: createdTodo.description,
  timeSlot: createdTodo.timeSlot,
  status: createdTodo.status,
  createdAt: createdTodo.createdAt,
});

const toTodoFromUpdateResponse = (
  updatedTodo: UpdateAdminTodoResponse,
  previousTodo?: Todo,
): Todo => ({
  ...previousTodo,
  todoId: updatedTodo.todoId,
  description: updatedTodo.description,
  timeSlot: updatedTodo.timeSlot,
  status: updatedTodo.status,
  createdAt: previousTodo?.createdAt ?? updatedTodo.updatedAt,
});

export const useCreateAdminTodoMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: createAdminTodo, isPending: isPendingCreateAdminTodo } =
    useMutation<CreateAdminTodoResponse, ApiError, CreateAdminTodoRequest>({
      mutationFn: createAdminTodoApi,
      onSuccess: (createdTodo) => {
        queryClient.setQueryData<GetTodosResponse>(
          TODOS_QUERY_KEY.LIST(createdTodo.date),
          (currentTodos) => {
            if (!currentTodos) {
              return currentTodos;
            }

            return appendTodoToPeriod(
              currentTodos,
              toTodoFromCreateResponse(createdTodo),
            );
          },
        );
      },
    });

  return {
    createAdminTodo,
    isPendingCreateAdminTodo,
  };
};

export const useUpdateAdminTodoMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: updateAdminTodo, isPending: isPendingUpdateAdminTodo } =
    useMutation<UpdateAdminTodoResponse, ApiError, UpdateAdminTodoRequest>({
      mutationFn: updateAdminTodoApi,
      onSuccess: (updatedTodo) => {
        queryClient.setQueriesData<GetTodosResponse>(
          { queryKey: TODOS_QUERY_KEY.ALL },
          (currentTodos) => {
            if (!currentTodos) {
              return currentTodos;
            }

            const previousTodo = [
              ...currentTodos.morningTodos,
              ...currentTodos.afternoonTodos,
            ].find((todo) => todo.todoId === updatedTodo.todoId);
            const todosWithoutUpdatedTodo = removeTodoFromList(
              currentTodos,
              updatedTodo.todoId,
            );

            if (currentTodos.date !== updatedTodo.date && !previousTodo) {
              return currentTodos;
            }

            if (currentTodos.date !== updatedTodo.date) {
              return todosWithoutUpdatedTodo;
            }

            return appendTodoToPeriod(
              todosWithoutUpdatedTodo,
              toTodoFromUpdateResponse(updatedTodo, previousTodo),
            );
          },
        );
      },
    });

  return {
    updateAdminTodo,
    isPendingUpdateAdminTodo,
  };
};

export const useDeleteAdminTodoMutation = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteAdminTodo, isPending: isPendingDeleteAdminTodo } =
    useMutation<void, ApiError, DeleteAdminTodoRequest>({
      mutationFn: deleteAdminTodoApi,
      onSuccess: (_, { todoId }) => {
        queryClient.setQueriesData<GetTodosResponse>(
          { queryKey: TODOS_QUERY_KEY.ALL },
          (currentTodos) =>
            currentTodos
              ? removeTodoFromList(currentTodos, todoId)
              : currentTodos,
        );
      },
    });

  return {
    deleteAdminTodo,
    isPendingDeleteAdminTodo,
  };
};
