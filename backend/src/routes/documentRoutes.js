import express from "express";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  analyzeDoc,
} from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getDocuments).post(handleUpload, uploadDocument);
router.delete("/:id", deleteDocument);
router.post("/:id/analyze", analyzeDoc);

export default router;