import express from "express";
import { getQuiz, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, getQuiz);
router.post("/submit", protect, submitQuiz);

export default router;
