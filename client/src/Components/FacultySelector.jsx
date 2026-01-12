import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function FacultySelector({ redirectTo }) {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    api.get("/faculty").then((r) => setFaculty(r.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Select Faculty
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {faculty.map((f) => (
          <Link
            key={f.faculty_id}
            to={`/${redirectTo}/${f.faculty_id}`}
            className="rounded-xl bg-white/10 border border-white/20 p-6 text-center hover:scale-105 transition"
          >
            <h2 className="text-white font-semibold">{f.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
