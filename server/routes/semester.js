import express from "express";
import db from "../db.js";

const router = express.Router();

/* ================= GET ALL SEMESTERS ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.semester_id, s.faculty_id, s.sem_no, s.title, f.title AS faculty_title
      FROM semester s
      JOIN faculty f ON s.faculty_id = f.faculty_id
      ORDER BY s.sem_no
    `);
    res.json(rows);
  } catch (err) {
    console.error("GET semesters ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD SEMESTER ================= */
router.post("/", async (req, res) => {
  try {
    const { faculty_id, sem_no, title } = req.body;

    if (!faculty_id || !sem_no || !title) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Optional: check if faculty exists
    const [faculty] = await db.query(
      "SELECT * FROM faculty WHERE faculty_id=?",
      [faculty_id]
    );
    if (!faculty.length) {
      return res.status(400).json({ error: "Selected faculty does not exist" });
    }

    await db.query(
      "INSERT INTO semester (faculty_id, sem_no, title) VALUES (?, ?, ?)",
      [faculty_id, sem_no, title.trim()]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("INSERT semester ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE SEMESTER ================= */
router.put("/:id", async (req, res) => {
  try {
    const { faculty_id, sem_no, title } = req.body;

    if (!faculty_id || !sem_no || !title) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Optional: check if faculty exists
    const [faculty] = await db.query(
      "SELECT * FROM faculty WHERE faculty_id=?",
      [faculty_id]
    );
    if (!faculty.length) {
      return res.status(400).json({ error: "Selected faculty does not exist" });
    }

    await db.query(
      "UPDATE semester SET faculty_id=?, sem_no=?, title=? WHERE semester_id=?",
      [faculty_id, sem_no, title.trim(), req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE semester ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= DELETE SEMESTER ================= */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM semester WHERE semester_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE semester ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET SEMESTERS BY FACULTY ================= */
router.get("/faculty/:facultyId", async (req, res) => {
  const { facultyId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT semester_id, sem_no, title
       FROM semester
       WHERE faculty_id = ?
       ORDER BY sem_no`,
      [facultyId]
    );

    res.json(rows); // returns array of semesters for this faculty
  } catch (err) {
    console.error("GET semesters for faculty ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
