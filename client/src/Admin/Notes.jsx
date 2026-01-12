import { useEffect, useState } from "react";
import { api } from "../api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [semester, setSemester] = useState([]);
  const [subject, setSubject] = useState([]);

  const [facultyId, setFacultyId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const loadNotes = async () => {
    const res = await api.get("/usernotes");
    setNotes(res.data);
  };

  useEffect(() => {
    api.get("/faculty").then((r) => setFaculty(r.data));
    loadNotes();
  }, []);

  useEffect(() => {
    if (!facultyId) {
      setSemester([]);
      setSemesterId("");
      return;
    }
    api.get(`/semester/${facultyId}`).then((r) => setSemester(r.data));
  }, [facultyId]);

  useEffect(() => {
    if (!semesterId) {
      setSubject([]);
      setSubjectId("");
      return;
    }
    api.get(`/subject/semester/${semesterId}`).then((r) => setSubject(r.data));
  }, [semesterId]);

  const submit = async () => {
    if (!subjectId || !title || !file) {
      alert("Title, subject and PDF are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("subject_id", subjectId);
    if (image) fd.append("image", image);
    fd.append("file", file);

    await api.post("/usernotes", fd);

    setTitle("");
    setImage(null);
    setFile(null);
    setFacultyId("");
    setSemesterId("");
    setSubjectId("");
    loadNotes();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await api.delete(`/usernotes/${id}`);
    loadNotes();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Notes Management</h2>

      {/* FORM */}
      <div className="grid grid-cols-3 gap-3">
        <select
          className="border p-2"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
        >
          <option value="">Faculty</option>
          {faculty.map((f) => (
            <option key={f.faculty_id} value={f.faculty_id}>
              {f.title}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
        >
          <option value="">Semester</option>
          {semester.map((s) => (
            <option key={s.semester_id} value={s.semester_id}>
              Semester {s.sem_no}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Subject</option>
          {subject.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 col-span-3"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={submit}
          className="col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Note
        </button>
      </div>

      {/* TABLE – SAME DESIGN AS OTHERS */}
      <div className="overflow-x-auto rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="text-xs uppercase bg-white/20">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Faculty</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {notes.map((n) => (
              <tr
                key={n.note_id}
                className="border-t border-white/10 hover:bg-white/10"
              >
                <td className="px-6 py-4">
                  <img
                    src={
                      n.image_url
                        ? `${BASE_URL}${n.image_url}`
                        : "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="px-6 py-4 font-medium">{n.title}</td>
                <td className="px-6 py-4">{n.subject_name}</td>
                <td className="px-6 py-4">{n.faculty_name}</td>

                <td className="px-6 py-4 text-right space-x-2">
                  <a
                    href={`${BASE_URL}${n.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/40"
                  >
                    View
                  </a>

                  <button
                    onClick={() => remove(n.note_id)}
                    className="px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
