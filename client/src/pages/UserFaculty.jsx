import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function UserFaculty() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    api.get("/faculty").then((res) => setFaculty(res.data));
  }, []);

  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <h1 className="text-3xl text-white font-bold text-center mb-8">
        Select Faculty
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {faculty.map((f) => (
          <Link
            key={f.faculty_id}
            to={`/faculty/${f.faculty_id}`}
            className="group rounded-xl overflow-hidden bg-white/10 border border-white/20 hover:shadow-2xl transition"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={`${BASE_URL}${f.image_url}`}
                alt={f.title}
                className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/300x200")
                }
              />
            </div>

            <div className="p-4 text-center">
              <h2 className="text-white font-semibold group-hover:text-blue-400">
                {f.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
