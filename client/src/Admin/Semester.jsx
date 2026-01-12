import { useEffect, useState } from "react";
import { api } from "../api";

export default function Semester() {
  const [list, setList] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [facultyId, setFacultyId] = useState("");
  const [semNo, setSemNo] = useState("");
  const [title, setTitle] = useState("");

  const [editId, setEditId] = useState(null);

  /* LOAD SEMESTERS */
  const load = async () => {
    try {
      const res = await api.get("/semester");
      setList(res.data);
    } catch (err) {
      console.error("Load semesters ERROR:", err);
      alert("Failed to load semesters");
    }
  };

  useEffect(() => {
    api
      .get("/faculty")
      .then((r) => setFaculties(r.data))
      .catch((err) => {
        console.error("Load faculties ERROR:", err);
        alert("Failed to load faculties");
      });
    load();
  }, []);

  /* SUBMIT */
  const submit = async () => {
    // Validation
    const facultyNum = parseInt(facultyId, 10);
    const semNum = parseInt(semNo, 10);

    if (isNaN(facultyNum) || isNaN(semNum) || !title.trim()) {
      alert("All fields are required and must be valid");
      return;
    }

    const payload = {
      faculty_id: facultyNum,
      sem_no: semNum,
      title: title.trim(),
    };

    try {
      if (editId) {
        await api.put(`/semester/${editId}`, payload);
      } else {
        await api.post("/semester", payload);
      }

      reset();
      load();
    } catch (err) {
      console.error("Submit ERROR:", err);
      alert(err.response?.data?.error || "Operation failed");
    }
  };

  const reset = () => {
    setFacultyId("");
    setSemNo("");
    setTitle("");
    setEditId(null);
  };

  const edit = (s) => {
    setFacultyId(String(s.faculty_id));
    setSemNo(s.sem_no);
    setTitle(s.title);
    setEditId(s.semester_id);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete semester?")) return;
    try {
      await api.delete(`/semester/${id}`);
      load();
    } catch (err) {
      console.error("Delete ERROR:", err);
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Semester Management</h2>

      {/* FORM */}
      <div className="grid grid-cols-4 gap-3">
        <select
          className="border p-2"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
        >
          <option value="">Select faculty</option>
          {faculties.map((f) => (
            <option key={f.faculty_id} value={f.faculty_id}>
              {f.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          className="border p-2"
          placeholder="Semester No"
          value={semNo}
          onChange={(e) => setSemNo(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Semester title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={submit} className="bg-blue-600 text-white rounded">
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl bg-white/10 border border-white/20">
        <table className="w-full text-sm text-gray-200">
          <thead className="bg-white/20">
            <tr>
              <th className="px-6 py-4">Faculty</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((s) => (
              <tr
                key={s.semester_id}
                className="border-t border-white/10 hover:bg-white/10"
              >
                <td className="px-6 py-4">{s.faculty_title}</td>
                <td className="px-6 py-4">Semester {s.sem_no}</td>
                <td className="px-6 py-4">{s.title}</td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => edit(s)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(s.semester_id)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No semesters found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
