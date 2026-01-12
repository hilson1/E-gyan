import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v) => v.length >= 8;

  const handleRegister = async () => {
    setServerError("");

    if (!username.trim()) return;
    if (!validateEmail(email)) return setEmailError(true);
    if (!validatePassword(password)) return setPasswordError(true);
    if (password !== confirmPassword) return setConfirmPasswordError(true);

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: username.trim(),
        email,
        password,
      });

      navigate("/components/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mb-10 bg-gray-900 rounded-xl shadow-inner">
      <h1 className="text-3xl font-semibold text-center mb-4">Register</h1>

      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <div className="space-y-4">
        <div>
          <label>User Name</label>
          <input
            className="w-full px-3 py-2 rounded-lg border"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            className={`w-full px-3 py-2 rounded-lg border ${
              emailError ? "border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(!validateEmail(e.target.value));
            }}
          />
          {emailError && <p className="text-red-500 text-sm">Invalid email</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className={`w-full px-3 py-2 rounded-lg border ${
              passwordError ? "border-red-500" : ""
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(!validatePassword(e.target.value));
            }}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            className={`w-full px-3 py-2 rounded-lg border ${
              confirmPasswordError ? "border-red-500" : ""
            }`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(e.target.value !== password);
            }}
          />
        </div>

        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={handleRegister}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <button
            onClick={() => navigate("/components/login")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
