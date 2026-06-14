import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

// Invalidates the todos list so UI refreshes automatically
function useInvalidateTodos() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["todos"] });
}

export function useCreateTodo() {
  const invalidateTodos = useInvalidateTodos();
  return useMutation({
    mutationFn: (formData) => axiosClient.post("/todos", formData),
    onSuccess:  invalidateTodos,
  });
}

export function useUpdateTodo() {
  const invalidateTodos = useInvalidateTodos();
  return useMutation({
    mutationFn: ({ todoId, updates }) =>
      axiosClient.patch(`/todos/${todoId}`, updates),
    onSuccess: invalidateTodos,
  });
}

export function useDeleteTodo() {
  const invalidateTodos = useInvalidateTodos();
  return useMutation({
    mutationFn: (todoId) => axiosClient.delete(`/todos/${todoId}`),
    onSuccess:  invalidateTodos,
  });
}
