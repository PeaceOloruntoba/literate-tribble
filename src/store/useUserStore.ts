import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { handleError } from "../utils/handleError";

export interface AppUser {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string | string[];
  image?: string;
  isEmailVerified?: boolean;
  plan?: "free" | "premium" | "enterprise";
  isSubActive?: boolean;
  trialEndDate?: string;
  roles?: string[];
  isAdmin?: boolean;
}

export interface UsersState {
  users: AppUser[];
  selectedUser: AppUser | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchUsers: () => Promise<void>;
  fetchUserById: (userId: string) => Promise<void>;
  clearSelected: () => void;
}

export const useUserStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      selectedUser: null,
      isLoading: false,
      error: null,
      hasFetched: false,

      fetchUsers: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const res = await api.get("/api/v1/admin/users");
          // Support either {data: {users}} or array fallback
          const raw =
            res.data?.data?.users ??
            res.data?.data?.items ??
            res.data?.data ??
            res.data ??
            [];
          const mapped: AppUser[] = (Array.isArray(raw) ? raw : []).map(
            (u: any) => ({
              id: u.id || u._id,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
              businessName: u.businessName,
              businessType: u.businessType,
              isEmailVerified: u.isEmailVerified,
              image: u.image,
              plan: u.plan,
              isSubActive: u.isSubActive,
              trialEndDate: u.trialEndDate,
              roles: u.roles ?? [],
              isAdmin: (u.roles ?? []).includes("admin"),
              createdAt: u.createdAt,
              updatedAt: u.updatedAt,
            })
          );
          set({ users: mapped, isLoading: false, hasFetched: true });
        } catch (err) {
          const { message } = handleError(err);
          set({ error: message, isLoading: false, hasFetched: true });
        }
      },

      fetchUserById: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.get(`/api/v1/admin/users/${userId}`);
          const u = res.data?.data?.user ?? res.data?.data ?? res.data ?? {};
          const mapped: AppUser = {
            id: u.id || u._id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            businessName: u.businessName,
            businessType: u.businessType,
            isEmailVerified: u.isEmailVerified,
            image: u.image,
            plan: u.plan,
            isSubActive: u.isSubActive,
            trialEndDate: u.trialEndDate,
            roles: u.roles ?? [],
            isAdmin: (u.roles ?? []).includes("admin"),
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          };
          set({ selectedUser: mapped, isLoading: false });
        } catch (err) {
          const { message } = handleError(err);
          set({ error: message, isLoading: false });
        }
      },

      clearSelected: () => set({ selectedUser: null }),
    }),
    {
      name: "users-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        users: s.users,
        selectedUser: s.selectedUser,
      }),
      version: 1,
    }
  )
);
