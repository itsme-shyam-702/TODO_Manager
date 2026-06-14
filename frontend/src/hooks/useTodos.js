import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

// Fetches todos — re-runs when filters change (TanStack Query key changes)
export function useTodos(filters = {}) {
  return useQuery({
    queryKey: ["todos", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const { data } = await axiosClient.get(`/todos?${params}`);
      return data.todos;
    },
  });
}
