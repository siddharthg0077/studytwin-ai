import express from "express";
import { generate, submit } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/generate", generate);
router.post("/:id/submit", submit);

export default router;