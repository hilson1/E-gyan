import express from "express";
import multer from "multer";
import db from "../db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

/* ========= PATH SETUP ========= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ========= UPLOAD DIRECTORY ========= */
const uploadDir = path.join(__dirname, "../uploads/profile");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ========= MULTER CONFIG ========= */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ========= GET USER ========= */
router.get("/:id", async (req, res) => {
  try {
    const [[user]] = await db.query(
      `SELECT id, name, email, profile_image, created_at
       FROM users WHERE id=?`,
      [req.params.id]
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ========= GET USER ACTIVITY ========= */
router.get("/:id/activity", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, module, action, item_id, created_at
       FROM user_activity
       WHERE user_id=?
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("ACTIVITY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ========= UPDATE PROFILE IMAGE ========= */
router.post(
  "/:id/profile-image",
  upload.single("profile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `${process.env.APP_URL}/uploads/profile/${req.file.filename}`;

      await db.query("UPDATE users SET profile_image=? WHERE id=?", [
        imageUrl,
        req.params.id,
      ]);

      res.json({ image: imageUrl });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
