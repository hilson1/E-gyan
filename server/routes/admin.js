import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

/* ================= ADMIN REGISTER ================= */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const [exists] = await db.query("SELECT id FROM admins WHERE email = ?", [
    email,
  ]);

  if (exists.length) {
    return res.status(409).json({ message: "Admin already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO admins (username, email, password) VALUES (?, ?, ?)",
    [username, email, hash]
  );

  res.status(201).json({ message: "Admin registered" });
});

/* ================= ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [
    username,
  ]);

  if (!rows.length) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const admin = rows[0];
  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

export default router;
