import { useNavigate, Link, Outlet } from "react-router-dom";
import { adminLogout } from "./Security/Auth";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="drawer lg:drawer-open h-screen">
      {/* Drawer toggle */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* ================= MAIN CONTENT ================= */}
      <div className="drawer-content flex flex-col">
        {/* TOP NAVBAR */}
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div className="flex-1">
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>

          <div className="flex-none gap-2">
            {/* USER MENU */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-base-200">
                  <img
                    src="/shield.svg"
                    alt="admin"
                    className="w-6 h-6 text-primary"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>

        <aside className="bg-base-200 w-64 p-4 h-full">
          <h2 className="text-xl font-bold mb-4">E-Gyan</h2>

          <ul className="menu space-y-1">
            <li>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/users">Users</Link>
            </li>
            <li>
              <Link to="/admin/faculty">Faculty</Link>
            </li>
            <li>
              <Link to="/admin/semester">Semester</Link>
            </li>
            <li>
              <Link to="/admin/subject">Subject</Link>
            </li>
            <li>
              <Link to="/admin/notes">Notes</Link>
            </li>
            <li>
              <Link to="/admin/presentation">Presentation</Link>
            </li>
            <li>
              <Link to="/admin/questions">Questions</Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
