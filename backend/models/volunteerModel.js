const pool = require("../config/db");

async function isRapidDuplicate(email, cooldownSeconds) {
  const [rows] = await pool.query(
    "SELECT id, created_at FROM volunteers WHERE email = ? ORDER BY id DESC LIMIT 1",
    [email]
  );

  if (!rows || rows.length === 0) return false;

  const last = rows[0].created_at;
  const lastMs = last instanceof Date ? last.getTime() : new Date(last).getTime();
  return Date.now() - lastMs < cooldownSeconds * 1000;
}

async function createVolunteer({ name, email, phone, skills, message }) {
  await pool.query(
    "INSERT INTO volunteers (name, email, phone, skills, message) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone || null, skills, message || null]
  );
}

async function getAllVolunteers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, skills, message, created_at FROM volunteers ORDER BY id DESC"
  );
  return rows;
}

module.exports = { isRapidDuplicate, createVolunteer, getAllVolunteers };
