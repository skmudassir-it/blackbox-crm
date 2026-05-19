import { Router, Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/appointments — list appointments (scoped to agent, with optional filters)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.user!.userId;
    const { status, from, to } = req.query;

    const filter: Record<string, any> = { agentId };

    if (
      status &&
      ["scheduled", "completed", "cancelled"].includes(status as string)
    ) {
      filter.status = status;
    }

    // Date range filter
    if (from || to) {
      filter.date = {};
      if (from && typeof from === "string") {
        filter.date.$gte = new Date(from);
      }
      if (to && typeof to === "string") {
        filter.date.$lte = new Date(to);
      }
    }

    const appointments = await Appointment.find(filter).sort({
      date: 1,
      startTime: 1,
    });
    res.json(appointments);
  } catch (err: any) {
    console.error("List appointments error:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// POST /api/appointments — create a new appointment
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      clientId,
      clientName,
      date,
      startTime,
      endTime,
      type,
      status,
      notes,
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }
    if (!clientName || !clientName.trim()) {
      res.status(400).json({ error: "Client name is required" });
      return;
    }
    if (!date) {
      res.status(400).json({ error: "Date is required" });
      return;
    }
    if (!startTime) {
      res.status(400).json({ error: "Start time is required" });
      return;
    }
    if (!endTime) {
      res.status(400).json({ error: "End time is required" });
      return;
    }
    if (!type || !["call", "meeting", "followup", "renewal"].includes(type)) {
      res.status(400).json({
        error: "Valid type is required (call, meeting, followup, renewal)",
      });
      return;
    }

    // Validate time format HH:mm
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(startTime)) {
      res
        .status(400)
        .json({ error: "startTime must be in HH:mm format (e.g., 14:30)" });
      return;
    }
    if (!timeRegex.test(endTime)) {
      res
        .status(400)
        .json({ error: "endTime must be in HH:mm format (e.g., 15:00)" });
      return;
    }

    const appointment = new Appointment({
      title: title.trim(),
      clientId,
      clientName: clientName.trim(),
      date: new Date(date),
      startTime,
      endTime,
      type,
      status: status || "scheduled",
      notes,
      agentId: req.user!.userId,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Create appointment error:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// PUT /api/appointments/:id — update an appointment
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields = [
      "title",
      "clientId",
      "clientName",
      "date",
      "startTime",
      "endTime",
      "type",
      "status",
      "notes",
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validate type if present
    if (
      updates.type &&
      !["call", "meeting", "followup", "renewal"].includes(updates.type)
    ) {
      res.status(400).json({
        error: "Type must be one of: call, meeting, followup, renewal",
      });
      return;
    }

    // Validate status if present
    if (
      updates.status &&
      !["scheduled", "completed", "cancelled"].includes(updates.status)
    ) {
      res.status(400).json({
        error: "Status must be one of: scheduled, completed, cancelled",
      });
      return;
    }

    // Validate time format if present
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (updates.startTime && !timeRegex.test(updates.startTime)) {
      res
        .status(400)
        .json({ error: "startTime must be in HH:mm format (e.g., 14:30)" });
      return;
    }
    if (updates.endTime && !timeRegex.test(updates.endTime)) {
      res
        .status(400)
        .json({ error: "endTime must be in HH:mm format (e.g., 15:00)" });
      return;
    }

    // Parse date if present
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json(appointment);
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Update appointment error:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// DELETE /api/appointments/:id — delete an appointment
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid appointment ID" });
      return;
    }
    console.error("Delete appointment error:", err);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

export default router;
