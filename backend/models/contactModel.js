const pool = require("../config/db");

async function isRapidDuplicate(email, cooldownSeconds) {
  const [rows] = await pool.query(
    "SELECT id, created_at FROM contacts WHERE email = ? ORDER BY id DESC LIMIT 1",
    [email]
  );

  if (!rows || rows.length === 0) return false;

  const last = rows[0].created_at;
  const lastMs = last instanceof Date ? last.getTime() : new Date(last).getTime();
  return Date.now() - lastMs < cooldownSeconds * 1000;
}

async function createContact({ name, email, message }) {
  await pool.query("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)", [
    name,
    email,
    message,
  ]);
}

async function getAllContacts() {
  const [rows] = await pool.query(
    "SELECT id, name, email, message, created_at FROM contacts ORDER BY id DESC"
  );
  return rows;
}

module.exports = { isRapidDuplicate, createContact, getAllContacts };
