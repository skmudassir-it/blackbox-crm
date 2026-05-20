import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { authenticate, generateToken, AuthPayload } from "../middleware/auth";
import { GmailToken } from "../models/GmailToken";
import { SentEmail } from "../models/SentEmail";
import { Contact } from "../models/Contact";
import { Client } from "../models/Client";
import { Todo } from "../models/Todo";
import { DocumentModel } from "../models/Document";
import { Appointment } from "../models/Appointment";
import { KanbanColumn } from "../models/Kanban";

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
        profilePicture: user.profilePicture,
        subscription: user.subscription,
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
        profilePicture: user.profilePicture,
        subscription: user.subscription,
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
        profilePicture: user.profilePicture,
        subscription: user.subscription,
      });
    } catch (err: any) {
      console.error("Me error:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

// PUT /api/auth/profile — update user details
router.put(
  "/profile",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as AuthPayload).userId;
      const { name, agency, currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Update name
      if (name !== undefined) {
        if (!name.trim()) {
          res.status(400).json({ error: "Name cannot be empty" });
          return;
        }
        user.name = name.trim();
      }

      // Update agency
      if (agency !== undefined) {
        user.agency = agency.trim();
      }

      // Update password (requires current password verification)
      if (newPassword) {
        if (!currentPassword) {
          res.status(400).json({ error: "Current password is required to set a new password" });
          return;
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          res.status(401).json({ error: "Current password is incorrect" });
          return;
        }
        if (newPassword.length < 6) {
          res.status(400).json({ error: "New password must be at least 6 characters" });
          return;
        }
        user.password = newPassword;
      }

      await user.save();

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        agency: user.agency,
        profilePicture: user.profilePicture,
        subscription: user.subscription,
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      res.status(500).json({ error: "Failed to update profile" });
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

// DELETE /api/auth/account — permanently delete user and all data
router.delete(
  "/account",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as AuthPayload).userId;
      const { password } = req.body;

      if (!password) {
        res.status(400).json({ error: "Password is required to delete your account" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: "Incorrect password" });
        return;
      }

      // Delete all user data
      await Promise.all([
        GmailToken.deleteMany({ userId }),
        SentEmail.deleteMany({ userId }),
        Contact.deleteMany({ userId }),
        Client.deleteMany({ userId }),
        Todo.deleteMany({ userId }),
        DocumentModel.deleteMany({ userId }),
        Appointment.deleteMany({ userId }),
        KanbanColumn.deleteMany({ userId }),
      ]);

      // Delete user last
      await User.findByIdAndDelete(userId);

      res.json({ message: "Account permanently deleted" });
    } catch (err: any) {
      console.error("Delete account error:", err);
      res.status(500).json({ error: "Failed to delete account" });
    }
  }
);

export default router;
