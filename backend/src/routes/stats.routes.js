import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import errorResponse from "../utils/errorResponse.js";

const router = express.Router();

/**
 * GET /stats
 */
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // total tickets (excluding soft-deleted)
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM tickets WHERE deleted_at IS NULL"
    );

    // status counts
    const statusResult = await pool.query(
      `
      SELECT status, COUNT(*) 
      FROM tickets
      WHERE deleted_at IS NULL
      GROUP BY status
      `
    );

    // high priority count
    const highPriorityResult = await pool.query(
      `
      SELECT COUNT(*) 
      FROM tickets
      WHERE priority = 'high' AND deleted_at IS NULL
      `
    );

    // last 7 days creation data
    const last7DaysResult = await pool.query(
      `
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) 
      FROM tickets
      WHERE created_at >= NOW() - INTERVAL '7 days'
        AND deleted_at IS NULL
      GROUP BY DATE(created_at)
      ORDER BY date ASC
      `
    );

    // format status counts
    const statusCounts = {
      open: 0,
      pending: 0,
      resolved: 0
    };

    statusResult.rows.forEach(row => {
      statusCounts[row.status] = parseInt(row.count);
    });

    res.json({
      totalTickets: parseInt(totalResult.rows[0].count),
      statusCounts,
      highPriorityCount: parseInt(highPriorityResult.rows[0].count),
      last7Days: last7DaysResult.rows
    });

  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch stats", 500);
  }
});

export default router;
