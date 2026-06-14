import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user:  null,
      token: null,

      // Called after login or register
      setAuth: (userData, tokenValue) =>
        set({ user: userData, token: tokenValue }),

      // Update user fields (e.g. after avatar upload)
      updateUser: (updatedFields) =>
        set((state) => ({ user: { ...state.user, ...updatedFields } })),

      // Clear everything on logout
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "todo-auth",         // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
