import mongoose, { Document, Schema } from "mongoose";
import { crmConnection } from "../config/crm-database";

export interface ITodo extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  category?: string;
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      required: true,
    },
    category: {
      type: String,
      trim: true,
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

// Indexes for filtered queries
todoSchema.index({ agentId: 1, status: 1 });
todoSchema.index({ agentId: 1, priority: 1 });
todoSchema.index({ agentId: 1, dueDate: 1 });

export const Todo = crmConnection.model<ITodo>("Todo", todoSchema);
