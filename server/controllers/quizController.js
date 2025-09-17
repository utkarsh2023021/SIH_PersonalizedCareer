import { generateQuiz, evaluateQuiz } from "../utils/geminiClient.js";

export const getQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const quiz = await generateQuiz(topic, difficulty);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { questions, answers } = req.body;
    const result = await evaluateQuiz(questions, answers);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
