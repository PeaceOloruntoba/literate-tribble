import { Navigate, Outlet, useLocation } from "react-router";
import Spinner from "../components/Spinner";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminGuard() {
  const location = useLocation();
  const { user, token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-w-screen min-h-screen grid place-items-center">
        <Spinner />
      </div>
    );
  }

  const isAdmin = !!user?.isAdmin;
  if (!token || !user || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
