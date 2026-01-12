import { useEffect, useState } from "react";
import { api } from "../api";

export default function Subject() {
  const [list, setList] = useState([]);

  const [faculties, setFaculties] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [facultyId, setFacultyId] = useState("");
  const [facultyTitle, setFacultyTitle] = useState("");

  const [semesterId, setSemesterId] = useState("");
  const [semesterTitle, setSemesterTitle] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [editId, setEditId] = useState(null);

  /* LOAD SUBJECT LIST */
  const loadsubject = async () => {
    const res = await api.get("/subject");
    setList(res.data);
  };

  /* INITIAL LOAD */
  useEffect(() => {
    api.get("/faculty").then((r) => setFaculties(r.data));
    loadsubject();
  }, []);

  /* LOAD SEMESTERS BY FACULTY (SAME AS NOTES) */
  useEffect(() => {
    if (!facultyId) {
      setSemesters([]);
      setSemesterId("");
      setSemesterTitle("");
      return;
    }

    api.get(`/semester/${facultyId}`).then((r) => setSemesters(r.data));
  }, [facultyId]);

  /* SUBMIT */
  const submit = async () => {
    if (!subjectName || !facultyId || !semesterId) {
      return alert("All fields required");
    }

    const payload = {
      subject_name: subjectName,
      semester_id: semesterId,
      semester_title: semesterTitle,
      faculty_title: facultyTitle,
    };

    try {
      if (editId) {
        await api.put(`/subject/${editId}`, payload);
      } else {
        await api.post("/subject", payload);
      }

      resetForm();
      loadsubject();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const resetForm = () => {
    setSubjectName("");
    setFacultyId("");
    setFacultyTitle("");
    setSemesterId("");
    setSemesterTitle("");
    setEditId(null);
  };

  const edit = (s) => {
    setSubjectName(s.subject_name);
    setSemesterId(s.semester_id);
    setSemesterTitle(s.semester_title);
    setFacultyTitle(s.faculty_title);
    setEditId(s.subject_id);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete subject?")) return;
    await api.delete(`/subject/${id}`);
    loadsubject();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Subject Management</h2>

      {/* FORM */}
      <div className="grid grid-cols-4 gap-3">
        <input
          className="border p-2"
          placeholder="Subject name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />

        {/* FACULTY (LIKE NOTES) */}
        <select
          className="border p-2"
          value={facultyId}
          onChange={(e) => {
            const id = e.target.value;
            const f = faculties.find((x) => x.faculty_id === Number(id));
            setFacultyId(id);
            setFacultyTitle(f?.title || "");
          }}
        >
          <option value="">Select faculty</option>
          {faculties.map((f) => (
            <option key={f.faculty_id} value={f.faculty_id}>
              {f.title}
            </option>
          ))}
        </select>

        {/* SEMESTER (DEPENDENT) */}
        <select
          className="border p-2"
          value={semesterId}
          onChange={(e) => {
            const id = e.target.value;
            const s = semesters.find((x) => x.semester_id === Number(id));
            setSemesterId(id);
            setSemesterTitle(s?.title || `Semester ${s?.sem_no}`);
          }}
        >
          <option value="">Select semester</option>
          {semesters.map((s) => (
            <option key={s.semester_id} value={s.semester_id}>
              Semester {s.sem_no}
            </option>
          ))}
        </select>

        {/* SEMESTER ID */}
        <input className="border p-2 bg-gray-100" value={semesterId} disabled />
      </div>

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-8 py-3 w-full rounded"
      >
        {editId ? "Update" : "Add"}
      </button>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="text-xs uppercase bg-white/20 text-gray-100">
            <tr>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">Faculty</th>
              <th className="px-6 py-4">Semester ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((s) => (
              <tr
                key={s.subject_id}
                className="border-t border-white/10 hover:bg-white/10"
              >
                <td className="px-6 py-4 font-medium text-white">
                  {s.subject_name}
                </td>

                <td className="px-6 py-4">{s.semester_title}</td>
                <td className="px-6 py-4">{s.faculty_title}</td>
                <td className="px-6 py-4">{s.semester_id}</td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => edit(s)}
                    className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/40"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(s.subject_id)}
                    className="px-3 py-1 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No subject found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
