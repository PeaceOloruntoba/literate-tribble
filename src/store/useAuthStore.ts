import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface User {
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

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  stripePublishableKey: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      stripePublishableKey: null,

      initializeAuth: async () => {
        const { token, user } = get();
        if (token && user) {
          set({ isLoading: true });
          try {
            const response = await api.get("/api/v1/auth");
            const fetchedUser = response.data.data.user;

            set({
              user: {
                id: fetchedUser.id || fetchedUser._id,
                email: fetchedUser.email,
                firstName: fetchedUser.firstName,
                lastName: fetchedUser.lastName,
                businessName: fetchedUser.businessName,
                businessType: fetchedUser.businessType,
                isEmailVerified: fetchedUser.isEmailVerified,
                image: fetchedUser.image,
                plan: fetchedUser.plan,
                isSubActive: fetchedUser.isSubActive,
                trialEndDate: fetchedUser.trialEndDate,
                roles: fetchedUser.roles ?? [],
                isAdmin: (fetchedUser.roles ?? []).includes("admin"),
              },
              isLoading: false,
              error: null,
            });
            console.log("Auth re-initialized with fresh user data.");
          } catch (error: any) {
            console.error(
              "Failed to re-initialize auth or token expired:",
              error
            );
            const { message } = handleError(error);
            get().logout();
            set({ error: message, isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/auth/signin", {
            email,
            password,
          });
          const { token, user: loggedInUser } = response.data.data;

          set({
            user: {
              id: loggedInUser.id || loggedInUser._id,
              email: loggedInUser.email,
              firstName: loggedInUser.firstName,
              lastName: loggedInUser.lastName,
              businessName: loggedInUser.businessName,
              businessType: loggedInUser.businessType,
              isEmailVerified: loggedInUser.isEmailVerified,
              image: loggedInUser.image,
              plan: loggedInUser.plan,
              isSubActive: loggedInUser.isSubActive,
              trialEndDate: loggedInUser.trialEndDate,
              roles: loggedInUser.roles ?? [],
              isAdmin: (loggedInUser.roles ?? []).includes("admin"),
            },
            token,
            isLoading: false,
          });
          toast.success("Logged in successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        if (api.defaults.headers.common["Authorization"]) {
          delete api.defaults.headers.common["Authorization"];
        }
        set({ user: null, token: null, isLoading: false, error: null });
        toast.info("Logged out successfully.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      version: 1,
      onRehydrateStorage: (_state) => {
        return (persistedState) => {
          if (persistedState && persistedState.token) {
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${persistedState.token}`;
          }
        };
      },
    }
  )
);