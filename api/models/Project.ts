import mongoose from "mongoose";
import type { Types } from "mongoose";
import { RAL_CLASSIC } from "../../src/constants/ral_classic_colors.js";

export interface ISheet extends mongoose.Document {
  profileType: string;
  textured: boolean;
  color: string; // juste string ici
  quantity: number;
  dimensions: Record<string, number>; // champs dynamiques du formulaire
}

export interface IJoinery extends mongoose.Document {
  name: string;
  type: string;
  imageURL?: string;
  sheets: Types.DocumentArray<ISheet>;
}

export interface IProject extends mongoose.Document {
  name: string;
  client: string;
  address: string;
  date: Date;
  notes: string;
  joineries: Types.DocumentArray<IJoinery>;
  imageURL?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sheetSchema = new mongoose.Schema<ISheet>(
  {
    profileType: {
      type: String,
      enum: ["appui", "tableau D", "tableau G", "linteau"],
      required: [true, "Profile type is required"],
    },
    textured: {
      type: Boolean,
      required: [true, "Textured flag is required"],
      default: false,
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
      enum: RAL_CLASSIC.map((c) => c.code),
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be positive"],
      default: 1,
    },
    dimensions: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

const joinerySchema = new mongoose.Schema<IJoinery>({
  name: {
    type: String,
    required: [true, "Joinery name is required"],
    trim: true,
    maxLength: [100, "Name cannot exceed 100 characters"],
  },
  imageURL: {
    type: String,
    required: false,
    maxLength: [150, "URL cannot exceed 150 characters"],
  },
  type: {
    type: String,
    required: [true, "Joinery type is required"],
    enum: ["fenetre", "porte", "baie"],
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
