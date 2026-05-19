import mongoose, { Document, Schema } from "mongoose";
import { crmConnection } from "../config/crm-database";

export interface IAppointment extends Document {
  title: string;
  clientId?: mongoose.Types.ObjectId;
  clientName: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: "call" | "meeting" | "followup" | "renewal";
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    type: {
      type: String,
      enum: ["call", "meeting", "followup", "renewal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      required: true,
    },
    notes: {
      type: String,
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

// Indexes for date-range and status queries
appointmentSchema.index({ agentId: 1, date: 1 });
appointmentSchema.index({ agentId: 1, status: 1 });

export const Appointment = crmConnection.model<IAppointment>(
  "Appointment",
  appointmentSchema
);
