import mongoose from "mongoose";
import type { Types } from "mongoose";
import { joinerySchema, IJoinery } from "./joinery.js";
import { IUser } from "./user.js";

export interface IProject extends mongoose.Document {
  name: string;
  client: string;
  address: string;
  date: Date;
  notes: string;
  joineries: Types.DocumentArray<IJoinery>;
  imageURL?: string;
  createdBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export const projectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxLength: [150, "Name cannot exceed 150 characters"],
    },
    imageURL: {
      type: String,
      required: false,
      maxLength: [150, "URL cannot exceed 150 characters"],
    },
    client: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxLength: [100, "Client name cannot exceed 100 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxLength: [200, "Address cannot exceed 200 characters"],
    },
    date: {
      type: Date,
      required: [true, "Project date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [1000, "Notes cannot exceed 1000 characters"],
    },
    joineries: [joinerySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes pour optimiser les recherches
projectSchema.index({ name: 1, client: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model<IProject>("Project", projectSchema);
