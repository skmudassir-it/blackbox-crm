import mongoose, { Document, Schema } from "mongoose";
import { crmConnection } from "../config/crm-database";

export interface IClient extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  policyType: "life" | "auto" | "home" | "health" | "commercial" | "other";
  policyNumber?: string;
  carrier?: string;
  status: "active" | "inactive" | "prospect";
  notes?: string;
  tags: string[];
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zip: {
      type: String,
      trim: true,
    },
    policyType: {
      type: String,
      enum: ["life", "auto", "home", "health", "commercial", "other"],
      required: true,
    },
    policyNumber: {
      type: String,
      trim: true,
    },
    carrier: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "prospect",
      required: true,
    },
    notes: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
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

// Compound index for scoped queries by agent
clientSchema.index({ agentId: 1, status: 1 });
clientSchema.index({ agentId: 1, lastName: 1, firstName: 1 });

export const Client = crmConnection.model<IClient>("Client", clientSchema);
