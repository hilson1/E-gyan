import { useEffect, useState } from "react";
import { api } from "../api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users"); // ✅ FIXED
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`); // ✅ FIXED
    loadUsers();
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email });
  };

  const saveEdit = async () => {
    await api.put(`/users/${editing.id}`, form); // ✅ FIXED
    setEditing(null);
    loadUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const resolveImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-300">Loading users...</div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-white">User Management</h2>

      <input
        className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-xl bg-white/10 border border-white/20">
        <table className="w-full text-sm text-gray-200">
          <thead className="bg-white/20">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="px-6 py-4">{i + 1}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 bg-gray-700">
                      {u.profile_image ? (
                        <img
                          src={resolveImage(u.profile_image)}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-blue-300 font-bold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-white">{u.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4">{u.email}</td>

                <td className="px-6 py-4 text-xs">
                  👁 {u.views || 0} ⬇ {u.downloads || 0} ✍ {u.creates || 0}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openEdit(u)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeUser(u.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-bold text-white">Edit User</h3>

            <input
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
