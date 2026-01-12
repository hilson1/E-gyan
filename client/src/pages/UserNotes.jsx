import { useEffect, useState } from "react";
import { api } from "../api";
import { useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function UserNotes() {
  const [notes, setNotes] = useState([]);
  const [params] = useSearchParams();

  // get faculty as STRING (safe)
  const facultyId = params.get("faculty");

  useEffect(() => {
    api.get("/usernotes").then((res) => {
      setNotes(res.data || []);
    });
  }, []);

  // filter safely
  const filteredNotes = facultyId
    ? notes.filter((n) => String(n.faculty_id) === String(facultyId))
    : notes;

  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <h1 className="text-3xl text-white font-bold text-center mb-8">Notes</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredNotes.map((n) => (
          <div
            key={n.note_id}
            className="bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            {/* IMAGE */}
            <div className="h-40 w-full overflow-hidden">
              <img
                src={
                  n.image_url
                    ? `${BASE_URL}${n.image_url}`
                    : "https://via.placeholder.com/300x200"
                }
                className="h-full w-full object-cover hover:scale-110 transition duration-500"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/300x200")
                }
                alt={n.title}
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 text-center">
              <h2 className="text-white font-semibold">{n.title}</h2>

              <p className="text-gray-300 text-sm">{n.subject_name}</p>

              <p className="text-gray-400 text-xs">
                Semester: {n.semester_no ?? "N/A"}
              </p>

              <p className="text-gray-400 text-xs">
                Faculty: {n.faculty_name ?? "N/A"}
              </p>

              <a
                href={`${BASE_URL}${n.file_url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No notes found.</p>
      )}
    </div>
  );
}
