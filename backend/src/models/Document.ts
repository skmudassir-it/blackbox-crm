import mongoose, { Document, Schema } from "mongoose";
import { crmConnection } from "../config/crm-database";

export interface IDocument extends Document {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
documentSchema.index({ agentId: 1, isPinned: -1, updatedAt: -1 });
documentSchema.index({ agentId: 1, tags: 1 });

export const DocumentModel = crmConnection.model<IDocument>(
  "Document",
  documentSchema
);
