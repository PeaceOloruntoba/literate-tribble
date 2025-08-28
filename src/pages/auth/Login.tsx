import { type FormEvent, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in and admin, redirect to dashboard
  useEffect(() => {
    if (token && user?.isAdmin) {
      const to = (location.state as any)?.from?.pathname || "/";
      navigate(to, { replace: true });
    }
  }, [token, user, navigate, location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // After login, ensure admin role
      const { user: u } = useAuthStore.getState();
      if (!u?.isAdmin) {
        toast.error("You do not have admin access.");
        useAuthStore.getState().logout();
        return;
      }
      const to = (location.state as any)?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch {
      // error handled by handleError + toast in store
    }
  };

  return (
    <div className="min-w-screen min-h-screen grid place-items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border rounded-md p-6"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="admin@example.com"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> <span>Signing in...</span>
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
