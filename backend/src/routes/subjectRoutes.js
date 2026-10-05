import express from "express";
import {
  createSubject,
  getSubjects,
  createTopic,
  getTopics,
  getOverview,
  updateTopicScore,
  deleteTopic,
} from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/overview", getOverview);
router.patch("/topics/:topicId", updateTopicScore);
router.route("/").get(getSubjects).post(createSubject);
router.route("/:subjectId/topics").get(getTopics).post(createTopic);
router.delete("/topics/:topicId", deleteTopic);

export default router;