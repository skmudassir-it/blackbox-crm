import { Router, Request, Response } from "express";
import { authenticate, AuthPayload } from "../middleware/auth";
import { User } from "../models/User";

const router = Router();
router.use(authenticate);

/** GET /api/subscription — get current subscription */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const user = await User.findById(userId).select("subscription email");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user.subscription || { plan: "free", status: "trial" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
