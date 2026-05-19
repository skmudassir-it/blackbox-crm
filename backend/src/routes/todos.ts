import { Router, Request, Response } from "express";
import { Todo } from "../models/Todo";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/todos — list todos (scoped to agent, with optional filters)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.user!.userId;
    const { status, priority, category } = req.query;

    const filter: Record<string, any> = { agentId };

    if (
      status &&
      ["pending", "in_progress", "completed"].includes(status as string)
    ) {
      filter.status = status;
    }

    if (
      priority &&
      ["low", "medium", "high"].includes(priority as string)
    ) {
      filter.priority = priority;
    }

    if (category && typeof category === "string" && category.trim()) {
      filter.category = { $regex: new RegExp(category.trim(), "i") };
    }

    const todos = await Todo.find(filter).sort({
      status: 1,
      dueDate: 1,
      priority: -1,
      createdAt: -1,
    });
    res.json(todos);
  } catch (err: any) {
    console.error("List todos error:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST /api/todos — create a new todo
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, priority, status, category } =
      req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      res
        .status(400)
        .json({ error: "Priority must be one of: low, medium, high" });
      return;
    }

    if (
      status &&
      !["pending", "in_progress", "completed"].includes(status)
    ) {
      res.status(400).json({
        error: "Status must be one of: pending, in_progress, completed",
      });
      return;
    }

    const todo = new Todo({
      title: title.trim(),
      description,
      dueDate,
      priority: priority || "medium",
      status: status || "pending",
      category,
      agentId: req.user!.userId,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Create todo error:", err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// PUT /api/todos/:id — update a todo
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields = [
      "title",
      "description",
      "dueDate",
      "priority",
      "status",
      "category",
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.priority &&
      !["low", "medium", "high"].includes(updates.priority)
    ) {
      res
        .status(400)
        .json({ error: "Priority must be one of: low, medium, high" });
      return;
    }

    if (
      updates.status &&
      !["pending", "in_progress", "completed"].includes(updates.status)
    ) {
      res.status(400).json({
        error: "Status must be one of: pending, in_progress, completed",
      });
      return;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.json(todo);
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid todo ID" });
      return;
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Update todo error:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE /api/todos/:id — delete a todo
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid todo ID" });
      return;
    }
    console.error("Delete todo error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default router;
