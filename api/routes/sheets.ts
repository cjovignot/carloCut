import express from "express";
import Project from "../../shared/types/project.js";
import { authenticate } from "../middleware/auth.js";
import { AuthRequest } from "../../shared/types/auth.js";

const router = express.Router();

// Add sheet
router.post(
  "/:projectId/joineries/:joineryId/sheets",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const joinery = project.joineries.find(
        (j) => j._id.toString() === req.params.joineryId
      );
      if (!joinery)
        return res.status(404).json({ message: "Joinery not found" });

      joinery.sheets.push(req.body);
      await project.save();

      const newSheet = joinery.sheets[joinery.sheets.length - 1];
      res.status(201).json(newSheet);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid token." });
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
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const joinery = project.joineries.find(
        (j) => j._id.toString() === req.params.joineryId
      );
      if (!joinery)
        return res.status(404).json({ message: "Joinery not found" });

      const sheet = joinery.sheets.find(
        (s) => s._id.toString() === req.params.sheetId
      );
      if (!sheet) return res.status(404).json({ message: "Sheet not found" });

      Object.assign(sheet, req.body);
      await project.save();

      res.json(sheet);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid token." });
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
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const joinery = project.joineries.find(
        (j) => j._id.toString() === req.params.joineryId
      );
      if (!joinery)
        return res.status(404).json({ message: "Joinery not found" });

      const index = joinery.sheets.findIndex(
        (s) => s._id.toString() === req.params.sheetId
      );
      if (index === -1)
        return res.status(404).json({ message: "Sheet not found" });

      joinery.sheets.splice(index, 1);
      await project.save();

      res.json({ message: "Sheet deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Invalid token." });
    }
  }
);

export default router;
