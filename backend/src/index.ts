import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth";
import clientsRoutes from "./routes/clients";
import todosRoutes from "./routes/todos";
import documentsRoutes from "./routes/documents";
import appointmentsRoutes from "./routes/appointments";
import dashboardRoutes from "./routes/dashboard";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes — Authentication
app.use("/api/auth", authRoutes);

// Routes — CRM modules
app.use("/api/clients", clientsRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Start server
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Blackbox CRM API running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
