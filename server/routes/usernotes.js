import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

import userAuth from "../middleware/userAuth.js";
import { trackActivity } from "../middleware/trackActivity.js";

const router = express.Router();

/* ========= ENSURE DIRECTORIES ========= */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir("uploads/images");
ensureDir("uploads/files");

/* ========= MULTER CONFIG ========= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") cb(null, "uploads/images");
    else cb(null, "uploads/files");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

/* ========= GET NOTES (LOG VIEW) ========= */
router.get(
  "/",
  userAuth,
  trackActivity("usernotes", "view"),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          n.note_id,
          n.title,
          n.image_url,
          n.file_url,
          s.subject_name,
          sem.sem_no AS semester_no,
          f.faculty_id,
          f.title AS faculty_name
        FROM usernotes n
        JOIN subject s ON n.subject_id = s.subject_id
        JOIN semester sem ON s.semester_id = sem.semester_id
        JOIN faculty f ON sem.faculty_id = f.faculty_id
        ORDER BY n.note_id DESC
      `);

      res.json(rows);
    } catch (err) {
      console.error("FETCH NOTES ERROR:", err);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  }
);

/* ========= OPEN NOTE PDF (THIS LOGS ACTIVITY) ========= */
router.get(
  "/open/:id",
  userAuth,
  trackActivity("usernotes", "open"),
  async (req, res) => {
    try {
      const [[note]] = await db.query(
        "SELECT file_url FROM usernotes WHERE note_id=?",
        [req.params.id]
      );

      if (!note) return res.sendStatus(404);

      const filePath = path.join(process.cwd(), note.file_url);
      res.sendFile(filePath);
    } catch (err) {
      console.error("OPEN NOTE ERROR:", err);
      res.sendStatus(500);
    }
  }
);

/* ========= ADD NOTE ========= */
router.post(
  "/",
  userAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  trackActivity("usernotes", "create"),
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
        `INSERT INTO usernotes (title, subject_id, image_url, file_url)
         VALUES (?,?,?,?)`,
        [title, subject_id, image_url, file_url]
      );

      res.json({ success: true });
    } catch (err) {
      console.error("INSERT NOTE ERROR:", err);
      res.status(500).json({ error: "Insert failed" });
    }
  }
);

/* ========= DELETE NOTE ========= */
router.delete(
  "/:id",
  userAuth,
  trackActivity("usernotes", "delete"),
  async (req, res) => {
    try {
      await db.query("DELETE FROM usernotes WHERE note_id=?", [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE NOTE ERROR:", err);
      res.status(500).json({ error: "Delete failed" });
    }
  }
);

export default router;
