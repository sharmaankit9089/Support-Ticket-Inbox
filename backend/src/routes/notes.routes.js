import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import errorResponse from "../utils/errorResponse.js";

const router = express.Router();


const sanitize = (text) => {
  return text.replace(/<[^>]*>?/gm, "");
};


router.get("/tickets/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT n.id, n.text, n.created_at, u.name AS author
      FROM notes n
      JOIN users u ON n.user_id = u.id
      WHERE n.ticket_id = $1
      ORDER BY n.created_at DESC
      `,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});


router.post("/tickets/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return errorResponse(res, "Note text required");

    }

    const cleanText = sanitize(text);

    const result = await pool.query(
      `
      INSERT INTO notes (ticket_id, user_id, text)
      VALUES ($1, $2, $3)
      RETURNING id, text, created_at
      `,
      [id, req.user.id, cleanText]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add note" });
  }
});

export default router;
