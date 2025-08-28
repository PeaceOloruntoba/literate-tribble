import { useAuthStore } from "../store/useAuthStore";
import Button from "./Button";
import { useNavigate } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <div className="h-full border-r p-4 flex flex-col gap-4">
      <div className="text-lg font-semibold">Admin Dashboard</div>
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
  );
}
