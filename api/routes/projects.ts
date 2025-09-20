import express from "express";
import Project from "../models/Project.js";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// ---------------------------
// Get all projects
// ---------------------------
router.get("/", authenticate, async (_req: AuthRequest, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------
// Get single project
// ---------------------------
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------
// Create project
// ---------------------------
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const projectData = { ...req.body, createdBy: req.user._id };
    const project = new Project(projectData);
    await project.save();

    await project.populate("createdBy", "name email");
    res.status(201).json(project);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------
// Update project
// ---------------------------
router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------
// Delete project (admin only)
// ---------------------------
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  async (req: AuthRequest, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
