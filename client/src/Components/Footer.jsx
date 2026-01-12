import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/bba.svg" alt="logo" className="w-12 h-12" />
            <h2 className="text-xl font-semibold text-white">E-Gyan</h2>
          </div>
          <p className="text-sm leading-relaxed">
            Comprehensive notes and academic resources for BBA (Banking &
            Insurance) students of Pokhara University.
          </p>
          <a
            href="mailto:info@egyan.com"
            className="inline-block mt-3 text-sm text-indigo-400 hover:underline"
          >
            info@egyan.com
          </a>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-4">About</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/syllabus" className="hover:text-white">
                Syllabus
              </Link>
            </li>
            <li>
              <Link to="/faculty" className="hover:text-white">
                Faculty
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 text-center py-4 text-sm text-gray-400">
        © 2025 E-Gyan — Empowering Students Through Knowledge<br></br> All
        rights reserved.
      </div>
    </footer>
  );
}
