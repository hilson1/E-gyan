import { Outlet } from "react-router-dom";
import AdminNavbar from "../Admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminNavbar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
