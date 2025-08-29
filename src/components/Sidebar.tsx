import { useAuthStore } from "../store/useAuthStore";
import Button from "./Button";
import { useNavigate } from "react-router";
import type { PropsWithChildren } from "react";

type SidebarProps = PropsWithChildren<{
  mobileOpen?: boolean;
  onClose?: () => void;
}>;

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <div
        className={
          // Hidden on mobile by default; show as overlay when mobileOpen
          // Fixed sidebar on md+ with a fixed width
          `md:fixed md:inset-y-0 md:left-0 z-50 bg-white border-r p-4 flex flex-col gap-4 
           w-72 md:w-64 transform transition-transform duration-200 ease-out
           ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`
        }
        role="dialog"
        aria-modal={mobileOpen ? true : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="text-base sm:text-lg font-semibold">Kunibi Admin Dashboard</div>
          {/* Close button visible on mobile */}
          {mobileOpen && (
            <button
              className="md:hidden p-2 rounded hover:bg-black/10"
              onClick={onClose}
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>
      <div className="py-12 flex flex-col gap-2">
        <Button
          className="w-full bg-transparent text-left text-lg font-semibold text-black/90 hover:text-black cursor-pointer rounded py-2 px-2 hover:bg-black/10"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>
        <Button
          className="w-full bg-transparent text-left text-lg font-semibold text-black/90 hover:text-black cursor-pointer rounded py-2 px-2 hover:bg-black/10"
          onClick={() => navigate("/users")}
        >
          Users
        </Button>
        <Button
          className="w-full bg-transparent text-left text-lg font-semibold text-black/90 hover:text-black cursor-pointer rounded py-2 px-2 hover:bg-black/10"
          onClick={() => navigate("/patterns")}
        >
          Patterns and Design
        </Button>
        <Button
          className="w-full bg-transparent text-left text-lg font-semibold text-black/90 hover:text-black cursor-pointer rounded py-2 px-2 hover:bg-black/10"
          onClick={() => navigate("/subscriptions")}
        >
          Subscriptions
        </Button>
        <Button
          className="w-full bg-transparent text-left text-lg font-semibold text-black/90 hover:text-black cursor-pointer rounded py-2 px-2 hover:bg-black/10"
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
      </div>
      <div className="mt-auto space-y-2">
        <div className="text-sm text-gray-600">
          Signed in as
          <div className="font-medium">{name || user?.email}</div>
        </div>
        <Button
          className="w-full bg-red-600 text-white rounded py-2 hover:bg-red-700"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
      </div>
    </>
  );
}

