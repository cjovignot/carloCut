import mongoose from "mongoose";
import type { Types } from "mongoose";
import { sheetSchema, ISheet } from "./sheet.js";

export interface IJoinery extends mongoose.Document {
  name: string;
  type: string;
  imageURL?: string;
  sheets: Types.DocumentArray<ISheet>;
}

export const joinerySchema = new mongoose.Schema<IJoinery>({
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
