import express from "express";
import db from "../db.js";

const router = express.Router();

/* GET resources by subject */
router.get("/subject/:subjectId", async (req, res) => {
  const { subjectId } = req.params;
  console.log("Requested subjectId:", subjectId); // debug

  try {
    const [rows] = await db.query(
      "SELECT * FROM resources WHERE subject_id = ?",
      [Number(subjectId)]
    );
    console.log("Rows fetched:", rows); // debug
    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load resources" });
  }
});

export default router;
