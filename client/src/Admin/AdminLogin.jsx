import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin as adminLoginAPI } from "../api/admin";
import { adminLogin } from "./Security/Auth";

export default function AdminLogin() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await adminLoginAPI(form);

      adminLogin(res.data.token); // ✅ token stored
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={submit}
        className="card w-full max-w-sm bg-base-100 shadow-xl"
      >
        <fieldset className="card-body">
          <legend className="text-2xl font-bold text-center">
            Admin Login
          </legend>

          <div className="form-control">
            <label className="label">Username</label>
            <input
              className="input input-bordered"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Password</label>
            <input
              type="password"
              className="input input-bordered"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-2">
            No account?{" "}
            <Link to="/admin/register" className="link link-primary">
              Register
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
