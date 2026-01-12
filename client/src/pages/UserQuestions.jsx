import { useEffect, useState } from "react";
import { api } from "../api";
import { useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function UserQuestions() {
  const [list, setList] = useState([]);
  const [params] = useSearchParams();
  const facultyId = params.get("faculty");

  useEffect(() => {
    api.get("/questions").then((r) => setList(r.data));
  }, []);

  const filtered = facultyId
    ? list.filter((q) => String(q.faculty_id) === String(facultyId))
    : list;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-black p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Question Papers
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((q) => (
          <div
            key={q.question_id}
            className="rounded-xl overflow-hidden bg-white/10 border border-white/20"
          >
            <div className="h-40">
              <img
                src={
                  q.image_url
                    ? `${BASE_URL}${q.image_url}`
                    : "https://via.placeholder.com/300x200"
                }
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-4 text-center">
              <h2 className="text-white font-semibold">{q.year}</h2>
              <p className="text-gray-300 text-sm">{q.subject_name}</p>
              <p className="text-gray-400 text-xs">Semester: {q.semester_no}</p>
              <p className="text-gray-400 text-xs">Faculty: {q.faculty_name}</p>

              <a
                href={`${BASE_URL}${q.file_url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded"
              >
                View Question
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No questions found.</p>
      )}
    </div>
  );
}
