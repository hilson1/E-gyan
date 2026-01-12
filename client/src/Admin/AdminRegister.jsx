import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminRegister } from "../api/admin";

export default function AdminRegister() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    await adminRegister(form);
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        onSubmit={submit}
        className="card w-full max-w-sm bg-base-100 shadow-xl"
      >
        <fieldset className="card-body">
          <legend className="text-2xl font-bold text-center">
            Admin Register
          </legend>

          <div className="form-control">
            <label className="label">Username</label>
            <input
              className="input input-bordered"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Password</label>
            <input
              type="password"
              className="input input-bordered"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="form-control mt-4">
            <button className="btn btn-primary">Register</button>
          </div>

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/admin/login" className="link link-primary">
              Login
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
