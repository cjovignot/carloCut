import express from "express";
import Project from "../../shared/types/project.js";
import { authenticate } from "../middleware/auth.js";
import { AuthRequest } from "../../shared/types/auth.js";

const router = express.Router();

// Add joinery to project
router.post(
  "/:projectId/joineries",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.joineries.push(req.body);
      await project.save();

      const newJoinery = project.joineries[project.joineries.length - 1];
      res.status(201).json(newJoinery);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Unknown server error" });
      }
    }
  }
);

// Update joinery
router.put(
  "/:projectId/joineries/:joineryId",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const joinery = project.joineries.id(req.params.joineryId);
      if (!joinery) {
        return res.status(404).json({ message: "Joinery not found" });
      }

      Object.assign(joinery, req.body);
      await project.save();

      res.json(joinery);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Unknown server error" });
      }
    }
  }
);

// Delete joinery
router.delete(
  "/:projectId/joineries/:joineryId",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.joineries.id(req.params.joineryId)?.deleteOne();
      await project.save();

      res.json({ message: "Joinery deleted successfully" });
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
