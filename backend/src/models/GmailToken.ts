import mongoose, { Document, Schema } from "mongoose";

export interface IGmailToken extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

const gmailTokenSchema = new Schema<IGmailToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiryDate: { type: Number, required: true },
    scope: { type: String },
  },
  { timestamps: true }
);

gmailTokenSchema.index({ userId: 1 }, { unique: true });

export const GmailToken = mongoose.model<IGmailToken>("GmailToken", gmailTokenSchema);
