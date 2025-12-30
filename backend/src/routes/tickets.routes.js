import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import errorResponse from "../utils/errorResponse.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, search } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM tickets
      WHERE deleted_at IS NULL
    `;
    let values = [];
    let idx = 1;

    if (status) {
      query += ` AND status = $${idx++}`;
      values.push(status);
    }

    if (priority) {
      query += ` AND priority = $${idx++}`;
      values.push(priority);
    }

    if (search) {
      query += ` AND (title ILIKE $${idx} OR customer_email ILIKE $${idx})`;
      values.push(`%${search}%`);
      idx++;
    }

    query += `
      ORDER BY created_at DESC, id DESC
      LIMIT $${idx++} OFFSET $${idx}
    `;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});


router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM tickets WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, "Ticket not found", 404);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch tickets", 500);
  }
});


router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    if (status === undefined && priority === undefined) {
      return errorResponse(res, "Nothing to update", 400);
    }

    const result = await pool.query(
      `
      UPDATE tickets
      SET
        status = COALESCE($1, status),
        priority = COALESCE($2, priority),
        updated_at = NOW()
      WHERE id = $3 AND deleted_at IS NULL
      RETURNING *
      `,
      [status ?? null, priority ?? null, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, "Ticket not found", 404);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update ticket", 500);
  }
});



router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE tickets
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

export default router;
