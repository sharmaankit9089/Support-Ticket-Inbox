import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

app.use(cors({
  origin: [
    "https://support-ticket-inbox-mp91.vercel.app",
    "http://localhost:5173" // for local development
  ],
  credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use(notesRoutes);
app.use(statsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

export default app;
