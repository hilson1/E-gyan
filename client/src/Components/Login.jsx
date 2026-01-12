import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import google from "../assets/google.svg";
import facebook from "../assets/facebook.svg";
import twitter from "../assets/twitter.png";
import linkedin from "../assets/linkedin.png";
import { api } from "../api";
import { auth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v) => v.length >= 8;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!validatePassword(value));
  };

  const handleLogin = async () => {
    setServerError("");

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      auth.setUser(res.data.user); // ✅ important

      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pb-8 mb-5 flex flex-col gap-4 bg-gray-900 shadow-inner rounded-xl my-4">
      <h1 className="text-3xl font-semibold text-center">Login</h1>

      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <div className="flex flex-col gap-1">
        <label className="font-medium">Email</label>
        <input
          type="email"
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
            emailError
              ? "border-red-500 ring-red-300"
              : "border-gray-300 focus:ring-blue-300"
          }`}
          placeholder="mail@gmail.com"
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && (
          <p className="text-red-500 text-sm">Enter a valid email address</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium">Password</label>
        <input
          type="password"
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
            passwordError
              ? "border-red-500 ring-red-300"
              : "border-gray-300 focus:ring-blue-300"
          }`}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        {passwordError && (
          <p className="text-red-500 text-sm">
            Password must be at least 8 characters
          </p>
        )}
      </div>

      <Link
        to="/components/forgot-password"
        className="text-blue-500 hover:underline"
      >
        Forgot Password? Click Here
      </Link>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="rememberMe" className="h-4 w-4" />
        <label htmlFor="rememberMe">Remember Me</label>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="font-bold text-lg">Login with</div>
        <div className="flex items-center gap-3">
          <button className="bg-white p-2 rounded-lg">
            <img src={google} alt="Google" className="w-6 h-6" />
          </button>
          <button className="bg-white p-2 rounded-lg">
            <img src={facebook} alt="Facebook" className="w-6 h-6" />
          </button>
          <button className="bg-white p-2 rounded-lg">
            <img src={twitter} alt="Twitter" className="w-6 h-6" />
          </button>
          <button className="bg-white p-2 rounded-lg">
            <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg ml-auto"
          onClick={() => navigate("/components/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
