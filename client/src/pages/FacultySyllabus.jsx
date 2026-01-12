import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function FacultySyllabus() {
  const { facultyId } = useParams();
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    api.get(`/syllabus/faculty/${facultyId}`).then((res) => {
      setSemesters(res.data);
    });
  }, [facultyId]);

  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <h1 className="text-2xl font-bold mb-6">Syllabus</h1>

      <div className="space-y-6">
        {semesters.map((sem) => (
          <div
            key={sem.semester_no}
            className="bg-white rounded-xl shadow border overflow-hidden"
          >
            <div className="bg-slate-900 text-white px-6 py-3 font-semibold">
              Semester {sem.semester_no}
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">
                    Subject Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {sem.subjects.length === 0 ? (
                  <tr>
                    <td className="px-6 py-4 text-gray-900">No subjects</td>
                  </tr>
                ) : (
                  sem.subjects.map((sub) => (
                    <tr
                      key={sub.subject_id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {sub.subject_name}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
