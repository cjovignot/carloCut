import mongoose from "mongoose";

export interface ISheet extends mongoose.Document {
  profileType: string;
  dimensions: number[];
  thickness: number;
  material: string;
  color: string;
  length: number;
  quantity: number;
}

export interface IJoinery extends mongoose.Document {
  name: string;
  type: string;
  sheets: ISheet[];
}

export interface IProject extends mongoose.Document {
  name: string;
  client: string;
  address: string;
  date: Date;
  notes: string;
  joineries: IJoinery[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sheetSchema = new mongoose.Schema<ISheet>({
  profileType: {
    type: String,
    required: [true, "Profile type is required"],
    enum: ["sill", "jamb", "lintel", "custom"],
  },
  dimensions: [
    {
      type: Number,
      required: true,
      min: [1, "Dimension must be positive"],
    },
  ],
  thickness: {
    type: Number,
    required: [true, "Thickness is required"],
    min: [0.1, "Thickness must be positive"],
  },
  material: {
    type: String,
    required: [true, "Material is required"],
    trim: true,
  },
  color: {
    type: String,
    required: [true, "Color is required"],
    trim: true,
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
