import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function DashboardLayout() {
  return (
    <div className="dashboard-shell">

      <Sidebar />

      <div className="website-content">

        <Topbar />

        <main className="dashboard-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;