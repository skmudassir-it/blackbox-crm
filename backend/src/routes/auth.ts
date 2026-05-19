import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { authenticate, generateToken, AuthPayload } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, agency } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
      return;
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      agency: agency || "",
    });
    await user.save();

    const token = generateToken({ _id: user._id as any, email: user.email });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        agency: user.agency,
      },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken({ _id: user._id as any, email: user.email });
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        agency: user.agency,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// GET /api/auth/me — get current user
router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById((req.user as AuthPayload).userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        agency: user.agency,
      });
    } catch (err: any) {
      console.error("Me error:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

// POST /api/auth/logout — client-side (stateless JWT)
router.post(
  "/logout",
  authenticate,
  async (_req: Request, res: Response): Promise<void> => {
    // JWT is stateless — client removes token
    res.json({ message: "Logged out successfully" });
  }
);

export default router;
