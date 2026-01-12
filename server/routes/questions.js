import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- MULTER ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(__dirname, "../uploads");
    cb(null, file.fieldname === "image" ? `${base}/images` : `${base}/files`);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------- GET ---------- */
router.get("/", async (_, res) => {
  try {
    const [rows] = await db.query(`
      SELECT q.question_id, q.year, q.file_url, q.image_url,
             s.subject_name, f.title AS faculty_name
      FROM questions q
      JOIN subject s ON q.subject_id = s.subject_id
      JOIN semester sem ON s.semester_id = sem.semester_id
      JOIN faculty f ON sem.faculty_id = f.faculty_id
      ORDER BY q.question_id DESC
    `);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
});

/* ---------- POST ---------- */
router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "file" }]),
  async (req, res) => {
    const { year, subject_id } = req.body;

    if (!year || !subject_id || !req.files?.file) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const image_url = req.files.image
      ? `/uploads/images/${req.files.image[0].filename}`
      : null;

    const file_url = `/uploads/files/${req.files.file[0].filename}`;

    try {
      await db.query(
        "INSERT INTO questions (year, subject_id, image_url, file_url) VALUES (?,?,?,?)",
        [year, subject_id, image_url, file_url]
      );
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Insert failed" });
    }
  }
);

/* ---------- DELETE ---------- */
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM questions WHERE question_id=?", [req.params.id]);
  res.json({ success: true });
});

export default router;
