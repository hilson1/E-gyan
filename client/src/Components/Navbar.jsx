import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export default function Navbar() {
  const [user, setUser] = useState(isLoggedIn());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => setUser(isLoggedIn());
    window.addEventListener("auth-change", updateUser);
    return () => window.removeEventListener("auth-change", updateUser);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-lg transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="sticky top-0 z-50 bg-slate-900 border-b border-white/10">
      <div className="navbar max-w-7xl mx-auto px-4 text-white">
        {/* LEFT */}
        <div className="navbar-start flex items-center gap-2">
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <img src="/bba.svg" alt="logo" className="w-9 h-9" />
            <span>E-Gyan</span>
          </Link>
        </div>

        {/* DESKTOP */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/syllabus" className={navLinkClass}>
              Syllabus
            </NavLink>
            <NavLink to="/faculty" className={navLinkClass}>
              Faculty
            </NavLink>
            <NavLink to={user ? "/account" : "/login"} className={navLinkClass}>
              {user ? "My Account" : "Login"}
            </NavLink>
          </ul>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900 text-white">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <span className="text-xl font-semibold">E-Gyan</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <nav className="p-6 space-y-4">
            <NavLink
              onClick={() => setOpen(false)}
              to="/"
              className={navLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/about"
              className={navLinkClass}
            >
              About
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/syllabus"
              className={navLinkClass}
            >
              Syllabus
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/faculty"
              className={navLinkClass}
            >
              Faculty
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to={user ? "/account" : "/login"}
              className={navLinkClass}
            >
              {user ? "My Account" : "Login"}
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
}
