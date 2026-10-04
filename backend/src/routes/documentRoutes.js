import express from "express";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getDocuments).post(handleUpload, uploadDocument);
router.delete("/:id", deleteDocument);

export default router;