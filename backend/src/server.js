import dotenv from "dotenv";
import app from "./app.js";
import pool from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

pool.query("SELECT NOW()")
  .then(res => console.log("DB connected"))
  .catch(err => console.error("DB connection failed", err));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
