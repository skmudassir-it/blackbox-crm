import { Router, Request, Response } from "express";
import { DocumentModel } from "../models/Document";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/documents — list documents (scoped to agent, with optional filters)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.user!.userId;
    const { tag, pinned } = req.query;

    const filter: Record<string, any> = { agentId };

    if (tag && typeof tag === "string" && tag.trim()) {
      filter.tags = { $in: [tag.trim()] };
    }

    if (pinned === "true" || pinned === "false") {
      filter.isPinned = pinned === "true";
    }

    const documents = await DocumentModel.find(filter).sort({
      isPinned: -1,
      updatedAt: -1,
    });
    res.json(documents);
  } catch (err: any) {
    console.error("List documents error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// POST /api/documents — create a new document
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, tags, isPinned } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const document = new DocumentModel({
      title: title.trim(),
      content: content || "",
      tags: tags || [],
      isPinned: isPinned || false,
      agentId: req.user!.userId,
    });

    await document.save();
    res.status(201).json(document);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Create document error:", err);
    res.status(500).json({ error: "Failed to create document" });
  }
});

// PUT /api/documents/:id — update a document
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields = ["title", "content", "tags", "isPinned"];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const document = await DocumentModel.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.json(document);
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid document ID" });
      return;
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Update document error:", err);
    res.status(500).json({ error: "Failed to update document" });
  }
});

// DELETE /api/documents/:id — delete a document
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const document = await DocumentModel.findOneAndDelete({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid document ID" });
      return;
    }
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;
