import { useEffect, useState } from "react";
import { api } from "../api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminFaculty() {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await api.get("/faculty");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!title) return alert("Title required");

    const fd = new FormData();
    fd.append("title", title);
    if (image) fd.append("image", image);

    try {
      if (editId) {
        await api.put(`/faculty/${editId}`, fd);
      } else {
        await api.post("/faculty", fd);
      }

      setTitle("");
      setImage(null);
      setEditId(null);
      load();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const edit = (f) => {
    setTitle(f.title);
    setEditId(f.faculty_id);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    await api.delete(`/faculty/${id}`);
    load();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Faculty Management</h2>

      <div className="grid grid-cols-3 gap-3">
        <input
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Faculty title"
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="text-xs uppercase bg-white/20 text-gray-100">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((f) => (
              <tr
                key={f.faculty_id}
                className="border-t border-white/10 hover:bg-white/10 transition"
              >
                <td className="px-6 py-4">
                  <img
                    src={
                      f.image_url
                        ? `${BASE_URL}${f.image_url}`
                        : "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/40";
                    }}
                  />
                </td>

                <td className="px-6 py-4 font-medium text-white">{f.title}</td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => edit(f)}
                    className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(f.faculty_id)}
                    className="px-3 py-1 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No faculty found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
