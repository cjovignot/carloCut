import express from "express";
import { Response } from "express";

import Project from "../../shared/types/project.js";
import { IProject } from "../../shared/types/project.js";

import { AuthRequest } from "../../shared/types/auth.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all projects
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unknown server error" });
    }
  }
});

// Get single project
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Unknown server error" });
    }
  }
});

// Create project
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const projectData: Partial<IProject> = {
      ...req.body,
      createdBy: req.user?._id,
    };
    const project = new Project(projectData);
    await project.save();

    await project.populate("createdBy", "name email");
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown server error" });
    }
  }
});

// Update project
router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown server error" });
    }
  }
});

// Delete project (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  async (req: AuthRequest, res: Response) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown server error" });
      }
    }
  }
);

export default router;
