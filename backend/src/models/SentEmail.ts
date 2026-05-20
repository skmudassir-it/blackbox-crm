import mongoose, { Document, Schema } from "mongoose";

export interface ISentEmail extends Document {
  userId: string;
  messageId: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  htmlBody: string;
  sentAt: Date;
}

const SentEmailSchema = new Schema<ISentEmail>({
  userId: { type: String, required: true, index: true },
  messageId: { type: String, required: true },
  threadId: { type: String, default: "" },
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, default: "" },
  htmlBody: { type: String, default: "" },
  sentAt: { type: Date, default: Date.now },
});

SentEmailSchema.index({ userId: 1, sentAt: -1 });

export const SentEmail = mongoose.model<ISentEmail>("SentEmail", SentEmailSchema);
