import dotenv from "dotenv";
import app from "./app.js";
import pool from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

pool.query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection failed:", err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
