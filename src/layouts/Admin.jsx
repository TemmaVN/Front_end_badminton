import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./admin/Sidebar";
import Header from "./admin/Header";
import { useUser } from "../contexts/UserContext";

const Admin = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  useEffect(() => {

    setIsSidebarOpen(sideBarCollapsed);
  }, [sideBarCollapsed]);
  const {loading} = useUser();
  if (loading) return (<div>
    Loading
  </div>)
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar
        sideBarCollapsed={sideBarCollapsed}
        onToggleSidebar={setSideBarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
        sideBarCollapsed={sideBarCollapsed}
        onToggleSidebar={setSideBarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
