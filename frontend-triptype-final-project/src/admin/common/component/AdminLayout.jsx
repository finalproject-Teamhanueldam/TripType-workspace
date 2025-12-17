import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminHeader from "./AdminHeader";
import AuthSidebar from "./AuthSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="admin-layout">
        <AuthSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
