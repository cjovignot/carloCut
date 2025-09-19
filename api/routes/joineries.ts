import express from "express";
import Project from "../models/Project.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
