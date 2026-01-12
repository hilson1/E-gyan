import { useEffect, useState } from "react";
import { api } from "../api";
import { useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function UserPresentation() {
  const [list, setList] = useState([]);
  const [params] = useSearchParams();
  const facultyId = params.get("faculty");

  useEffect(() => {
    api.get("/presentation").then((r) => setList(r.data));
  }, []);

  const filtered = facultyId
    ? list.filter((p) => String(p.faculty_id) === String(facultyId))
    : list;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-900 to-black p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Presentations
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div
            key={p.presentation_id}
            className="group rounded-xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-2xl transition"
          >
            {/* IMAGE */}
            <div className="h-40 w-full overflow-hidden">
              <img
                src={
                  p.image_url
                    ? `${BASE_URL}${p.image_url}`
                    : "https://via.placeholder.com/300x200"
                }
                className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/300x200")
                }
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 text-center">
              <h2 className="text-white font-semibold">{p.title}</h2>

              <p className="text-gray-300 text-sm mt-1">{p.subject_name}</p>

              <p className="text-gray-400 text-xs mt-1">
                Semester: {p.semester_no ?? "N/A"}
              </p>

              <p className="text-gray-400 text-xs">
                Faculty: {p.faculty_name ?? "N/A"}
              </p>

              <a
                href={`${BASE_URL}${p.file_url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Presentation
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No presentations found.
        </p>
      )}
    </div>
  );
}
