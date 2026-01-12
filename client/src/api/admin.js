import axios from "axios";

export const adminAPI = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

export const adminRegister = (data) => adminAPI.post("/register", data);

export const adminLogin = (data) => adminAPI.post("/login", data);
