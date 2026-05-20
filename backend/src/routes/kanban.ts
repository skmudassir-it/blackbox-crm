import { Router, Request, Response } from "express";
import { authenticate, AuthPayload } from "../middleware/auth";
import { KanbanColumn, IKanbanCard } from "../models/Kanban";

const router = Router();
router.use(authenticate);

// ---- Helper: get user's board ----
async function getBoard(userId: string) {
  return KanbanColumn.find({ userId }).sort("order");
}

// ---- Columns ----

/** GET /api/kanban — full board */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const columns = await getBoard(userId);
    res.json(columns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/kanban/columns — create column */
router.post("/columns", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const { title } = req.body;
    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const count = await KanbanColumn.countDocuments({ userId });
    const column = await KanbanColumn.create({ userId, title: title.trim(), order: count, cards: [] });
    res.status(201).json(column);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** PUT /api/kanban/columns/:id — rename column */
router.put("/columns/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }
    const column = await KanbanColumn.findByIdAndUpdate(req.params.id, { title: title.trim() }, { new: true });
    if (!column) { res.status(404).json({ error: "Column not found" }); return; }
    res.json(column);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** DELETE /api/kanban/columns/:id */
router.delete("/columns/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await KanbanColumn.findByIdAndDelete(req.params.id);
    res.json({ message: "Column deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Cards ----

/** POST /api/kanban/columns/:id/cards — add card to column */
router.post("/columns/:id/cards", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, assignee, dueDate, labels } = req.body;
    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const column = await KanbanColumn.findById(req.params.id);
    if (!column) { res.status(404).json({ error: "Column not found" }); return; }

    const card: IKanbanCard = {
      title: title.trim(),
      description: description || "",
      priority: priority || "medium",
      assignee: assignee || "",
      dueDate: dueDate || undefined,
      labels: labels || [],
      order: column.cards.length,
    };
    column.cards.push(card as any);
    await column.save();

    res.status(201).json(column.cards[column.cards.length - 1]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** PUT /api/kanban/columns/:colId/cards/:cardId — update card */
router.put("/columns/:colId/cards/:cardId", async (req: Request, res: Response): Promise<void> => {
  try {
    const column = await KanbanColumn.findById(req.params.colId);
    if (!column) { res.status(404).json({ error: "Column not found" }); return; }

    const card = (column.cards as any).id(req.params.cardId);
    if (!card) { res.status(404).json({ error: "Card not found" }); return; }

    const { title, description, priority, assignee, dueDate, labels } = req.body;
    if (title !== undefined) card.title = title.trim();
    if (description !== undefined) card.description = description;
    if (priority !== undefined) card.priority = priority;
    if (assignee !== undefined) card.assignee = assignee;
    if (dueDate !== undefined) card.dueDate = dueDate || null;
    if (labels !== undefined) card.labels = labels;

    await column.save();
    res.json(card);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** DELETE /api/kanban/columns/:colId/cards/:cardId */
router.delete("/columns/:colId/cards/:cardId", async (req: Request, res: Response): Promise<void> => {
  try {
    const column = await KanbanColumn.findById(req.params.colId);
    if (!column) { res.status(404).json({ error: "Column not found" }); return; }

    (column.cards as any).pull({ _id: req.params.cardId });
    await column.save();
    res.json({ message: "Card deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Drag & Drop / Reorder ----

/** PUT /api/kanban/reorder — move card between columns, reorder within */
router.put("/reorder", async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceColId, destColId, cardId, newIndex } = req.body;

    if (sourceColId === destColId) {
      // Same column — just reorder
      const column = await KanbanColumn.findById(sourceColId);
      if (!column) { res.status(404).json({ error: "Column not found" }); return; }

      const cardIdx = column.cards.findIndex((c: any) => c._id.toString() === cardId);
      if (cardIdx === -1) { res.status(404).json({ error: "Card not found" }); return; }

      const [card] = column.cards.splice(cardIdx, 1);
      column.cards.splice(newIndex, 0, card);
      column.cards.forEach((c: any, i: number) => { c.order = i; });
      await column.save();
    } else {
      // Cross-column move
      const [sourceCol, destCol] = await Promise.all([
        KanbanColumn.findById(sourceColId),
        KanbanColumn.findById(destColId),
      ]);
      if (!sourceCol || !destCol) { res.status(404).json({ error: "Column not found" }); return; }

      const cardIdx = sourceCol.cards.findIndex((c: any) => c._id.toString() === cardId);
      if (cardIdx === -1) { res.status(404).json({ error: "Card not found" }); return; }

      const [card] = sourceCol.cards.splice(cardIdx, 1);
      destCol.cards.splice(newIndex, 0, card);

      sourceCol.cards.forEach((c: any, i: number) => { c.order = i; });
      destCol.cards.forEach((c: any, i: number) => { c.order = i; });

      await Promise.all([sourceCol.save(), destCol.save()]);
    }

    // Return updated board
    const userId = (req.user as AuthPayload).userId;
    const columns = await getBoard(userId);
    res.json(columns);
  } catch (err: any) {
    console.error("Reorder error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
