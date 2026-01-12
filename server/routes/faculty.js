import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= GET ALL (USER + ADMIN) ================= */
// URL → GET /api/faculty
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT faculty_id, title, image_url FROM faculty"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
});

/* ================= ADD (ADMIN) ================= */
// URL → POST /api/faculty
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

    await db.query("INSERT INTO faculty (title, image_url) VALUES (?, ?)", [
      title,
      image_url,
    ]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  }
});

/* ================= UPDATE (ADMIN) ================= */
// URL → PUT /api/faculty/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    if (req.file) {
      await db.query(
        "UPDATE faculty SET title=?, image_url=? WHERE faculty_id=?",
        [title, `/uploads/images/${req.file.filename}`, req.params.id]
      );
    } else {
      await db.query("UPDATE faculty SET title=? WHERE faculty_id=?", [
        title,
        req.params.id,
      ]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

/* ================= DELETE (ADMIN) ================= */
// URL → DELETE /api/faculty/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM faculty WHERE faculty_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
