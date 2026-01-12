import express from "express";
import db from "../db.js";

const router = express.Router();

/* SUBJECTS GROUPED BY SEMESTER (1–8 SAFE) */
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const { facultyId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        sem.semester_id,
        sem.sem_no,
        s.subject_id,
        s.subject_name
      FROM semester sem
      LEFT JOIN subject s ON s.semester_id = sem.semester_id
      WHERE sem.faculty_id = ?
      ORDER BY sem.sem_no ASC, s.subject_name ASC
      `,
      [facultyId]
    );

    // initialize semesters 1–8
    const semesters = {};
    for (let i = 1; i <= 8; i++) {
      semesters[i] = {
        semester_no: i,
        subjects: [],
      };
    }

    // fill subjects
    for (const row of rows) {
      if (row.subject_id) {
        semesters[row.sem_no].subjects.push({
          subject_id: row.subject_id,
          subject_name: row.subject_name,
        });
      }
    }

    res.json(Object.values(semesters));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load syllabus" });
  }
});

export default router;
