// src/components/dashboard/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F4EBDD]">

      
      <aside className="w-72 bg-white shadow-sm">
        <Sidebar />
      </aside>

      
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}