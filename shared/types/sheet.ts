import mongoose from "mongoose";
import { RAL_CLASSIC } from "../../src/constants/ral_classic_colors.js";

export interface ISheet extends mongoose.Document {
  profileType: string;
  imageURL: string;
  modelId: string;
  textured: boolean;
  color: string; // juste string ici
  quantity: number;
  dimensions: Record<string, number>; // champs dynamiques du formulaire
}

export const sheetSchema = new mongoose.Schema<ISheet>(
  {
    profileType: {
      type: String,
      enum: ["appui", "tableau D", "tableau G", "linteau"],
      required: [true, "Profile type is required"],
    },
    imageURL: {
      type: String,
      required: [true, "imageURL type is required"],
    },
    modelId: {
      type: String,
      required: [true, "modelId is required"],
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
