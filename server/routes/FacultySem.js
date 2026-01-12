import express from "express";
import db from "../db.js";

const router = express.Router();

/* GET semesters by faculty */
router.get("/:faculty_id", async (req, res) => {
  try {
    const { faculty_id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM semester WHERE faculty_id = ?",
      [faculty_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
