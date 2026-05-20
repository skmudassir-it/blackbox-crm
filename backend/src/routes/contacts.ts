import { Router, Request, Response } from "express";
import { Contact } from "../models/Contact";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// GET /api/contacts — list contacts (scoped to agent)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.user!.userId;
    const { search, tag } = req.query;

    const filter: Record<string, any> = { agentId };

    if (search && typeof search === "string" && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { company: regex },
      ];
    }

    if (tag && typeof tag === "string") {
      filter.tags = tag;
    }

    const contacts = await Contact.find(filter).sort({ lastName: 1, firstName: 1 });
    res.json(contacts);
  } catch (err: any) {
    console.error("List contacts error:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// POST /api/contacts — create a contact
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, company, jobTitle, notes, tags } = req.body;

    if (!firstName || !lastName) {
      res.status(400).json({ error: "First name and last name are required" });
      return;
    }
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const contact = new Contact({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      company,
      jobTitle,
      notes,
      tags: tags || [],
      agentId: req.user!.userId,
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (err: any) {
    console.error("Create contact error:", err);
    if (err.code === 11000) {
      res.status(409).json({ error: "A contact with this email already exists" });
      return;
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    res.status(500).json({ error: "Failed to create contact" });
  }
});

// GET /api/contacts/:id — get a single contact
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    res.json(contact);
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid contact ID" });
      return;
    }
    console.error("Get contact error:", err);
    res.status(500).json({ error: "Failed to fetch contact" });
  }
});

// PUT /api/contacts/:id — update a contact
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const allowedFields = [
      "firstName", "lastName", "email", "phone",
      "company", "jobTitle", "notes", "tags",
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    res.json(contact);
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid contact ID" });
      return;
    }
    if (err.code === 11000) {
      res.status(409).json({ error: "A contact with this email already exists" });
      return;
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({ error: "Validation failed", details: messages });
      return;
    }
    console.error("Update contact error:", err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// DELETE /api/contacts/:id — delete a contact
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      agentId: req.user!.userId,
    });

    if (!contact) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (err: any) {
    if (err.name === "CastError") {
      res.status(400).json({ error: "Invalid contact ID" });
      return;
    }
    console.error("Delete contact error:", err);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

export default router;
