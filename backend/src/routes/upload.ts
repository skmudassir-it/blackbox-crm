import { Router, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { authenticate, AuthPayload } from "../middleware/auth";
import { User } from "../models/User";
import { uploadFile, generateProfilePicKey, deleteFile } from "../services/s3";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
    }
  },
});

// All routes require auth
router.use(authenticate);

/** POST /api/upload/profile-picture */
router.post(
  "/profile-picture",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const userId = (req.user as AuthPayload).userId;
      const ext = file.originalname.split(".").pop() || "jpg";
      const key = generateProfilePicKey(userId, ext);

      const url = await uploadFile(key, file.buffer, file.mimetype);

      // Delete old profile picture if exists
      const user = await User.findById(userId);
      if (user?.profilePicture) {
        try {
          const oldKey = user.profilePicture.split("/").slice(-2).join("/");
          await deleteFile(oldKey);
        } catch {
          // ignore — old file may not exist
        }
      }

      // Update user
      await User.findByIdAndUpdate(userId, { profilePicture: url });

      res.json({ url });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message || "Upload failed" });
    }
  }
);

/** DELETE /api/upload/profile-picture */
router.delete("/profile-picture", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const user = await User.findById(userId);
    if (!user?.profilePicture) {
      res.status(404).json({ error: "No profile picture to delete" });
      return;
    }

    try {
      const key = user.profilePicture.split("/").slice(-2).join("/");
      await deleteFile(key);
    } catch {
      // ignore
    }

    await User.findByIdAndUpdate(userId, { profilePicture: "" });
    res.json({ message: "Profile picture removed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
