// controllers/recommendationController.js
import { getCareerRecommendations, toFlowchartGraph } from "../utils/geminiClient.js";

export const getRecommendations = async (req, res) => {
  try {
    const { 
      scores, 
      stream, 
      interests, 
      experienceLevel, 
      careerGoals, 
      preferredIndustries, 
      learningStyle 
    } = req.body || {};

    if (!scores || typeof scores !== "object") {
      return res
        .status(400)
        .json({ message: "Invalid payload: require { scores: Object }" });
    }

    const recommendations = await getCareerRecommendations(
      scores, 
      stream, 
      interests || [], 
      experienceLevel, 
      careerGoals, 
      preferredIndustries || [], 
      learningStyle
    );
    const graph = toFlowchartGraph(recommendations);

    return res.json({
      ...recommendations,
      graph,
    });
  } catch (err) {
    console.error("Recommendation error:", err?.message);
    return res.status(500).json({ message: "Failed to generate recommendations" });
  }
};