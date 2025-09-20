import mongoose from "mongoose";
import type { Types } from "mongoose";
import { RAL_CLASSIC } from "../../src/constants/ral_classic_colors.ts";

export interface ISheet extends mongoose.Document {
  profileType: string;
  widthAppui: number;
  textured: boolean;
  dimensions: number[];
  color: string; // juste string ici
  length: number;
  quantity: number;
  segments: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[];
}

export interface IJoinery extends mongoose.Document {
  name: string;
  type: string;
  sheets: Types.DocumentArray<ISheet>;
}

export interface IProject extends Document {
  name: string;
  client: string;
  address: string;
  date: Date;
  notes: string;
  joineries: Types.DocumentArray<IJoinery>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sheetSchema = new mongoose.Schema<ISheet>({
  profileType: {
    type: String,
    required: [true, "Profile type is required"],
    enum: ["tableau G", "tableau D", "linteau", "appui"],
  },
  textured: {
    type: Boolean,
    required: [true, "Profile type is required"],
  },
  widthAppui: {
    type: Number,
    required: false,
    min: [1, "Dimension must be positive"],
  },
  dimensions: [
    {
      type: Number,
      required: true,
      min: [1, "Dimension must be positive"],
    },
  ],
  color: {
    type: String,
    required: [true, "Color is required"],
    trim: true,
    enum: RAL_CLASSIC.map((c) => c.code),
  },
  length: {
    type: Number,
    required: [true, "Length is required"],
    min: [1, "Length must be positive"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be positive"],
    default: 1,
  },
  segments: [
    {
      x1: { type: Number, required: true },
      y1: { type: Number, required: true },
      x2: { type: Number, required: true },
      y2: { type: Number, required: true },
    },
  ],
});

const joinerySchema = new mongoose.Schema<IJoinery>({
  name: {
    type: String,
    required: [true, "Joinery name is required"],
    trim: true,
    maxLength: [100, "Name cannot exceed 100 characters"],
  },
  type: {
    type: String,
    required: [true, "Joinery type is required"],
    enum: ["window", "door", "curtain-wall", "custom"],
  },
  sheets: [sheetSchema],
});

const projectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxLength: [150, "Name cannot exceed 150 characters"],
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

// Create indexes for better performance
projectSchema.index({ name: 1, client: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model<IProject>("Project", projectSchema);
