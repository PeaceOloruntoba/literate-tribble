import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function RootLayout() {
  return (
    <div className="w-screen min-h-screen flex justify-center">
      <div className="w-1/5 h-screen">
        <Sidebar />
      </div>
      <div className="w-4/5 p-6">
        <Outlet />
      </div>
    </div>
  );
}
