import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function RootLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      {/* Sidebar: overlay on mobile, fixed on desktop */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Content area: left padding on md+ to account for fixed sidebar width */}
      <div className="md:pl-64">
        {/* Top header with hamburger on mobile */}
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 px-3 sm:px-4 md:px-6 py-2">
          <button
            className="md:hidden p-2 rounded hover:bg-black/10"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="text-sm sm:text-base md:text-lg font-semibold">Admin Dashboard</h1>
        </header>

        <main className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
