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
import gmailRoutes from "./routes/gmail";
import uploadRoutes from "./routes/upload";
import subscriptionRoutes from "./routes/subscription";
import smtpRoutes from "./routes/smtp";
import kanbanRoutes from "./routes/kanban";
import contactsRoutes from "./routes/contacts";
import emailGenRoutes from "./routes/emailGen";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow frontend(s)
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow all nip.io subdomains and internal Docker requests
      if (origin.endsWith(".nip.io") || origin.startsWith("http://blackbox-backend")) return callback(null, true);
      console.log("CORS blocked origin:", origin, "allowed:", allowedOrigins);
      callback(null, false); // Send 403 instead of crashing
    },
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
app.use("/api/gmail", gmailRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/smtp", smtpRoutes);
app.use("/api/kanban", kanbanRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/email-gen", emailGenRoutes);

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
