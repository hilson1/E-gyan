import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Semester() {
  const { facultyId } = useParams();
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    api.get(`/semester/${facultyId}`).then((res) => setSemesters(res.data));
  }, [facultyId]);

  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {semesters.map((s) => (
          <Link
            key={s.semester_id}
            to={`/semester/${s.semester_id}/subjects`}
            className="bg-sky-500 text-white p-4 rounded text-center"
          >
            Semester {s.sem_no}
          </Link>
        ))}
      </div>
    </div>
  );
}
