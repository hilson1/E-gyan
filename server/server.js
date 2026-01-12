import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* ================= ROUTES ================= */
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/account.js";
import usersRoutes from "./routes/users.js";

import facultyRoutes from "./routes/faculty.js";
import facultyResources from "./routes/facultyresources.js";
import facultySemesterRoutes from "./routes/facultysem.js";

import semesterRoutes from "./routes/semester.js";
import subjectRoutes from "./routes/subject.js";

import userNoteRoutes from "./routes/usernotes.js";
import questionRoutes from "./routes/questions.js";
import presentationRoutes from "./routes/presentation.js";
import syllabusRoutes from "./routes/syllabus.js";
import resourceRoutes from "./routes/resources.js";

import adminRoutes from "./routes/admin.js";
import homeResourceRoutes from "./routes/homeresources.js";

/* ================= CONFIG ================= */
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================= UPLOAD DIRECTORIES ================= */
["uploads", "uploads/images", "uploads/files", "uploads/profile"].forEach(
  (dir) => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }
);

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= AUTH ================= */
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

/* ================= USERS ================= */
app.use("/api/users", usersRoutes);

/* ================= ACADEMICS ================= */
app.use("/api/faculty", facultyRoutes);
app.use("/api/faculty-resources", facultyResources);
app.use("/api/faculty-semester", facultySemesterRoutes);

app.use("/api/semester", semesterRoutes);
app.use("/api/subject", subjectRoutes);

/* ================= CONTENT ================= */
app.use("/api/usernotes", userNoteRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/presentation", presentationRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/resources", resourceRoutes);

/* ================= ADMIN ================= */
app.use("/api/admin", adminRoutes);

/* ================= HOME ================= */
app.use("/api/home-resources", homeResourceRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
