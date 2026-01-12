import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/auth";
import { api } from "../api";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD USER + ACTIVITY ================= */
  useEffect(() => {
    const stored = auth.getUser();
    if (!stored) {
      navigate("/components/login");
      return;
    }

    fetchUser(stored.id);
    loadActivity(stored.id);
  }, []);

  const fetchUser = async (id) => {
    const res = await api.get(`/account/${id}`);
    auth.setUser(res.data); // overwrite stale localStorage
    setUser(res.data);
  };

  const loadActivity = async (id) => {
    const res = await api.get(`/account/${id}/activity`);
    setActivities(res.data);
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("profile", file);

    setUploading(true);
    const res = await api.post(`/account/${user.id}/profile-image`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUploading(false);

    const updatedUser = {
      ...user,
      profile_image: `${res.data.image}?t=${Date.now()}`,
    };

    auth.setUser(updatedUser);
    setUser(updatedUser);
    setPreview(null);
  };

  if (!user) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-4 bg-slate-950 text-gray-200">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* PROFILE */}
        <div className="bg-gray-800 p-6 rounded-xl flex gap-6">
          <div className="relative">
            <img
              src={
                preview ||
                user.profile_image ||
                "https://via.placeholder.com/120"
              }
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/120")
              }
              className="w-28 h-28 rounded-full object-cover"
            />

            <label className="absolute bottom-0 right-0 bg-blue-600 text-xs px-2 py-1 rounded cursor-pointer">
              {uploading ? "Uploading..." : "Edit"}
              <input type="file" hidden onChange={handleImageChange} />
            </label>
          </div>

          <div>
            <p>ID: {user.id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="mb-4">Activity</h2>

          {activities.length === 0 ? (
            <p>No activity</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Item</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td>{a.module}</td>
                    <td>{a.action}</td>
                    <td>{a.item_id ?? "-"}</td>
                    <td>{new Date(a.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* LOGOUT */}
        <button
          className="bg-red-600 w-full py-2 rounded"
          onClick={() => {
            auth.clear();
            navigate("/components/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
