import { useEffect, useState } from "react";
import { api } from "../api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [semester, setSemester] = useState([]);
  const [subject, setSubject] = useState([]);

  const [facultyId, setFacultyId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [year, setYear] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const loadQuestions = async () => {
    const res = await api.get("/questions");
    setQuestions(res.data);
  };

  useEffect(() => {
    api.get("/faculty").then((r) => setFaculty(r.data));
    loadQuestions();
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
    if (!year || !subjectId || !file) {
      alert("Year, subject and file are required");
      return;
    }

    const fd = new FormData();
    fd.append("year", year);
    fd.append("subject_id", subjectId);
    if (image) fd.append("image", image);
    fd.append("file", file);

    await api.post("/questions", fd);

    setYear("");
    setImage(null);
    setFile(null);
    setFacultyId("");
    setSemesterId("");
    setSubjectId("");
    loadQuestions();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await api.delete(`/questions/${id}`);
    loadQuestions();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Question Management</h2>

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
          placeholder="Year (e.g. 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={submit}
          className="col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>

      {/* TABLE – SAME DESIGN AS PRESENTATION */}
      <div className="overflow-x-auto rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="text-xs uppercase bg-white/20">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Faculty</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr
                key={q.question_id}
                className="border-t border-white/10 hover:bg-white/10"
              >
                <td className="px-6 py-4">
                  <img
                    src={
                      q.image_url
                        ? `${BASE_URL}${q.image_url}`
                        : "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="px-6 py-4">{q.year}</td>
                <td className="px-6 py-4">{q.subject_name}</td>
                <td className="px-6 py-4">{q.faculty_name}</td>

                <td className="px-6 py-4 text-right space-x-2">
                  <a
                    href={`${BASE_URL}${q.file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/40"
                  >
                    View
                  </a>

                  <button
                    onClick={() => remove(q.question_id)}
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
