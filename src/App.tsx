import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import RootLayout from "./layout/RootLayout";
import AdminGuard from "./guard/AdminGuard";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import { useAuthStore } from "./store/useAuthStore";
import Users from "./pages/Users";

export default function App() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AdminGuard />}>
            <Route element={<RootLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}
