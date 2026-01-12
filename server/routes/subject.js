import express from "express";
import db from "../db.js";

const router = express.Router();

/* GET all subjects */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM subject ORDER BY subject_id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

/* GET subjects by semester */
router.get("/semester/:semesterId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM subject WHERE semester_id = ?",
      [req.params.semesterId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

/* CREATE subject */
router.post("/", async (req, res) => {
  const { semester_id, semester_title, faculty_title, subject_name } = req.body;

  if (!semester_id || !semester_title || !faculty_title || !subject_name) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO subject
       (semester_id, semester_title, faculty_title, subject_name)
       VALUES (?, ?, ?, ?)`,
      [semester_id, semester_title, faculty_title, subject_name]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

/* UPDATE subject */
router.put("/:id", async (req, res) => {
  const { semester_id, semester_title, faculty_title, subject_name } = req.body;

  try {
    await db.query(
      `UPDATE subject SET
        semester_id = ?,
        semester_title = ?,
        faculty_title = ?,
        subject_name = ?
       WHERE subject_id = ?`,
      [semester_id, semester_title, faculty_title, subject_name, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

/* DELETE subject */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM subject WHERE subject_id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
