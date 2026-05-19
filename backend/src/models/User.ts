import mongoose, { Document, Schema } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  agency?: string;
  profilePicture?: string;
  subscription?: {
    plan: string;
    status: "active" | "inactive" | "trial" | "expired";
    startDate?: Date;
    expiryDate?: Date;
    customerId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    agency: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    subscription: {
      type: {
        plan: { type: String, default: "free" },
        status: { type: String, enum: ["active", "inactive", "trial", "expired"], default: "trial" },
        startDate: { type: Date },
        expiryDate: { type: Date },
        customerId: { type: String },
      },
      default: { plan: "free", status: "trial" },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    if (ret.password) {
      delete ret.password;
    }
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
