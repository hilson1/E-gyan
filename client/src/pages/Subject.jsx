import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { Outlet } from "react-router-dom";

export default function Subject() {
  const { facultyId, semesterId } = useParams();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api
      .get(`/subject/semester/${semesterId}`)
      .then((res) => setSubjects(res.data))
      .catch(console.error);
  }, [semesterId]);

  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-center">Select Subject</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <Link
            key={s.subject_id}
            to={`/faculty/${facultyId}/semester/${semesterId}/subject/${s.subject_id}`}
            className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition"
          >
            <h3 className="font-semibold text-white">{s.subject_name}</h3>
          </Link>
        ))}

        {subjects.length === 0 && (
          <p className="text-gray-400">No subjects found</p>
        )}
      </div>
      <Outlet />
    </div>
  );
}
