import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        resource_id,
        resource_type,
        title,
        file_url,
        image_url,
        created_at
      FROM resources
      WHERE resource_type COLLATE utf8mb4_general_ci
        IN (
          'note' COLLATE utf8mb4_general_ci,
          'question' COLLATE utf8mb4_general_ci,
          'presentation' COLLATE utf8mb4_general_ci
        )
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json({
      notes: rows.filter((r) => r.resource_type === "note").slice(0, 6),
      questions: rows.filter((r) => r.resource_type === "question").slice(0, 6),
      presentations: rows
        .filter((r) => r.resource_type === "presentation")
        .slice(0, 6),
    });
  } catch (err) {
    console.error("HOME RESOURCES ERROR:", err);
    res.status(500).json({ error: "Failed to load home resources" });
  }
});

export default router;
