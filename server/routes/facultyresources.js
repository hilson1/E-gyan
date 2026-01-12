import express from "express";
import db from "../db.js";

const router = express.Router();

/*
  GET RESOURCES BY FACULTY
  Returns notes, questions, presentations
*/
router.get("/:facultyId", async (req, res) => {
  const { facultyId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        r.resource_id,
        r.resource_type,
        r.title,
        r.year,
        r.file_url,
        r.image_url,
        r.created_at
      FROM resources r
      JOIN subject s ON r.subject_id = s.subject_id
      JOIN semester sem ON s.semester_id = sem.semester_id
      WHERE sem.faculty_id = ?
      ORDER BY r.created_at DESC
      `,
      [Number(facultyId)]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("FACULTY RESOURCES ERROR:", err);
    res.status(500).json({ error: "Failed to load faculty resources" });
  }
});

export default router;
