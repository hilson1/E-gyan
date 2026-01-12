import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ---------- MULTER ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") cb(null, "uploads/images");
    else cb(null, "uploads/files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------- GET PRESENTATIONS (USER + ADMIN) ---------- */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.presentation_id,
        p.title,
        p.image_url,
        p.file_url,
        s.subject_name,
        sem.sem_no AS semester_no,
        f.title AS faculty_name
      FROM presentation p
      JOIN subject s ON p.subject_id = s.subject_id
      JOIN semester sem ON s.semester_id = sem.semester_id
      JOIN faculty f ON sem.faculty_id = f.faculty_id
      ORDER BY p.presentation_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch presentations" });
  }
});

/* ---------- ADD PRESENTATION (ADMIN) ---------- */
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, subject_id } = req.body;

    if (!title || !subject_id || !req.files?.file) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const image_url = req.files.image
      ? `/uploads/images/${req.files.image[0].filename}`
      : null;

    const file_url = `/uploads/files/${req.files.file[0].filename}`;

    try {
      await db.query(
        `INSERT INTO presentation (title, subject_id, image_url, file_url)
         VALUES (?,?,?,?)`,
        [title, subject_id, image_url, file_url]
      );

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Insert failed" });
    }
  }
);

/* ---------- DELETE PRESENTATION ---------- */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM presentation WHERE presentation_id=?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
