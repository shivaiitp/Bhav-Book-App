import express from "express";
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
} from "../controllers/journal.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadJournalMedia } from "../middlewares/multer.js";
const router = express.Router();
router.get("/", isAuthenticated, getJournalEntries);
router.get("/:id", isAuthenticated, getJournalEntryById);
router.post("/create", isAuthenticated, uploadJournalMedia, createJournalEntry);
router.put("/:id", isAuthenticated, uploadJournalMedia, updateJournalEntry);
router.delete("/:id", isAuthenticated, deleteJournalEntry);

export default router;
