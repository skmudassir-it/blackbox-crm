import mongoose, { Document, Schema } from "mongoose";
import { crmConnection } from "../config/crm-database";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  tags: string[];
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
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
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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

contactSchema.index({ agentId: 1, lastName: 1, firstName: 1 });
contactSchema.index({ agentId: 1, email: 1 });

export const Contact = crmConnection.model<IContact>("Contact", contactSchema);
