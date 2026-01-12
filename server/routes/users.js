import express from "express";
import multer from "multer";
import db from "../db.js";

const router = express.Router();

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: "uploads/profile",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `user_${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

/* ================= GET ALL USERS ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        email,
        profile_image,
        created_at,
        0 AS views,
        0 AS downloads,
        0 AS creates
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE USER ================= */
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;
  await db.query("UPDATE users SET name=?, email=? WHERE id=?", [
    name,
    email,
    req.params.id,
  ]);
  res.json({ success: true });
});

/* ================= DELETE USER ================= */
router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
  res.json({ success: true });
});

export default router;
