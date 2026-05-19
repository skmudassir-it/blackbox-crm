import { Router, Request, Response } from "express";
import { Client } from "../models/Client";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/clients — list clients (scoped to agent)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.user!.userId;
    const { search, status, policyType } = req.query;

    const filter: Record<string, any> = { agentId };

    if (status && ["active", "inactive", "prospect"].includes(status as string)) {
      filter.status = status;
    }

    if (
      policyType &&
      ["life", "auto", "home", "health", "commercial", "other"].includes(
        policyType as string
      )
    ) {
      filter.policyType = policyType;
    }

    if (search && typeof search === "string" && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { policyNumber: regex },
        { carrier: regex },
      ];
    }

    const clients = await Client.find(filter).sort({ lastName: 1, firstName: 1 });
    res.json(clients);
  } catch (err: any) {
    console.error("List clients error:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// POST /api/clients — create a new client
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      policyType,
      policyNumber,
      carrier,
      status,
      notes,
      tags,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      res
        .status(400)
        .json({ error: "First name and last name are required" });
      return;
    }
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    if (
      !policyType ||
      !["life", "auto", "home", "health", "commercial", "other"].includes(
        policyType
      )
    ) {
      res.status(400).json({
        error:
          "Valid policyType is required (life, auto, home, health, commercial, other)",
      });
      return;
    }

    const client = new Client({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      address,
      city,
      state,
      zip,
      policyType,
      policyNumber,
      carrier,
      status: status || "prospect",
      notes,
      tags: tags || [],
      agentId: req.user!.userId,
    });

    await client.save();
    res.status(201).json(client);
  } catch (err: any) {
    console.error("Create client error:", err);

    // Mongoose duplicate key
    if (err.code === 11000) {
      res.status(409).json({ error: "A client with this email already exists" });
      return;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }

    res.status(500).json({ error: "Failed to create client" });
  }
});

// GET /api/clients/:id — get a single client
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json(client);
  } catch (err: any) {
    // Invalid ObjectId
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    console.error("Get client error:", err);
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

// PUT /api/clients/:id — update a client
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zip",
      "policyType",
      "policyNumber",
      "carrier",
      "status",
      "notes",
      "tags",
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validate policyType if present
    if (
      updates.policyType &&
      !["life", "auto", "home", "health", "commercial", "other"].includes(
        updates.policyType
      )
    ) {
      res.status(400).json({
        error:
          "Invalid policyType. Must be one of: life, auto, home, health, commercial, other",
      });
      return;
    }

    // Validate status if present
    if (
      updates.status &&
      !["active", "inactive", "prospect"].includes(updates.status)
    ) {
      res.status(400).json({
        error: "Invalid status. Must be one of: active, inactive, prospect",
      });
      return;
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json(client);
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    if (err.code === 11000) {
      res.status(409).json({ error: "A client with this email already exists" });
      return;
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Update client error:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
});

// DELETE /api/clients/:id — delete a client
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!client) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    res.json({ message: "Client deleted successfully" });
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid client ID" });
      return;
    }
    console.error("Delete client error:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
