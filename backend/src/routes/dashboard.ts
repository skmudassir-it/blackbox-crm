import { Router, Request, Response } from "express";
import { Client } from "../models/Client";
import { Todo } from "../models/Todo";
import { DocumentModel } from "../models/Document";
import { Appointment } from "../models/Appointment";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/dashboard — aggregate stats for the current agent
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.user!.userId;

    // Run all queries in parallel
    const [
      totalClients,
      activeClients,
      pendingTodos,
      upcomingAppointments,
      recentDocuments,
    ] = await Promise.all([
      Client.countDocuments({ agentId }),

      Client.countDocuments({ agentId, status: "active" }),

      Todo.countDocuments({
        agentId,
        status: { $in: ["pending", "in_progress"] },
      }),

      Appointment.find({
        agentId,
        status: "scheduled",
        date: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })
        .sort({ date: 1, startTime: 1 })
        .limit(10),

      DocumentModel.find({ agentId })
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    res.json({
      totalClients,
      activeClients,
      pendingTodos,
      upcomingAppointments,
      recentDocuments,
    });
  } catch (err: any) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;
