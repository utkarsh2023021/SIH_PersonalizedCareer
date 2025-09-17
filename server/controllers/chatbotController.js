import { chatWithLLM } from "../utils/geminiClient.js";

export const chatBot = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await chatWithLLM(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
