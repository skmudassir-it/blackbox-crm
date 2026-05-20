import mongoose, { Document, Schema } from "mongoose";

// ---- Card Subdocument ----
export interface IKanbanCard {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: Date;
  labels?: string[];
  order: number;
}

const cardSchema = new Schema<IKanbanCard>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assignee: { type: String, default: "" },
    dueDate: { type: Date },
    labels: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

// ---- Column ----
export interface IKanbanColumn extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  order: number;
  cards: IKanbanCard[];
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new Schema<IKanbanColumn>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    cards: [cardSchema],
  },
  { timestamps: true }
);

export const KanbanColumn = mongoose.model<IKanbanColumn>("KanbanColumn", columnSchema);
