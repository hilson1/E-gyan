import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { Outlet } from "react-router-dom";
export default function FacultySemester() {
  const { facultyId } = useParams();
  const [semesters, setSemesters] = useState([]);
  const [facultyTitle, setFacultyTitle] = useState("");

  useEffect(() => {
    api.get("/faculty").then((res) => {
      const faculty = res.data.find((f) => f.faculty_id === Number(facultyId));
      setFacultyTitle(faculty ? faculty.title : "");
    });

    api.get(`/semester/faculty/${facultyId}`).then((res) => {
      setSemesters(res.data);
    });
  }, [facultyId]);

  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <h1 className="text-3xl font-bold mb-6">{facultyTitle} Semesters</h1>

      <div className="space-y-4">
        {semesters.map((sem) => (
          <Link
            key={sem.semester_id}
            to={`/faculty/${facultyId}/semester/${sem.semester_id}`}
            className="block p-6 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
          >
            <h2 className="text-xl font-semibold">Semester {sem.sem_no}</h2>
            <p className="text-gray-300">{sem.title}</p>
          </Link>
        ))}

        {semesters.length === 0 && (
          <div className="text-gray-400">No semesters found</div>
        )}
      </div>
      <Outlet />
    </div>
  );
}
