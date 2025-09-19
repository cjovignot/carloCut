import express from "express";
import Project from "../models/Project.ts";
import { authenticate, AuthRequest } from "../middleware/auth.ts";

const router = express.Router();

// Add sheet to joinery
router.post(
  "/:projectId/joineries/:joineryId/sheets",
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

      joinery.sheets.push(req.body);
      await project.save();

      const newSheet = joinery.sheets[joinery.sheets.length - 1];
      res.status(201).json(newSheet);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update sheet
router.put(
  "/:projectId/joineries/:joineryId/sheets/:sheetId",
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

      const sheet = joinery.sheets.id(req.params.sheetId);
      if (!sheet) {
        return res.status(404).json({ message: "Sheet not found" });
      }

      Object.assign(sheet, req.body);
      await project.save();

      res.json(sheet);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete sheet
router.delete(
  "/:projectId/joineries/:joineryId/sheets/:sheetId",
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

      joinery.sheets.id(req.params.sheetId)?.deleteOne();
      await project.save();

      res.json({ message: "Sheet deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
