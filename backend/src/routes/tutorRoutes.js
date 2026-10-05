import express from "express";
import { chat, listConversations, getConversation } from "../controllers/tutorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/chat", chat);
router.get("/conversations", listConversations);
router.get("/conversations/:id", getConversation);

export default router;