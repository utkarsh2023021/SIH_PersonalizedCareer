// controllers/recommendationController.js
import { getCareerRecommendations } from "../utils/geminiClient.js";

// Function to generate a proper flowchart layout
function generateFlowchartLayout(courses, roles, flowEdges) {
  const nodes = [];
  const edges = [];
  
  // Position courses in a vertical column on the left
  const courseNodes = courses.map((course, index) => {
    return {
      id: course.id,
      type: "course",
      data: { 
        label: course.title,
        meta: { stream: course.stream, level: course.level }
      },
      position: { x: 100, y: 100 + index * 150 },
      style: { width: 200 },
    };
  });
  
  // Position roles in a vertical column on the right
  const roleNodes = roles.map((role, index) => {
    return {
      id: role.id,
      type: "role",
      data: { 
        label: role.title,
        meta: { description: role.description }
      },
      position: { x: 400, y: 100 + index * 150 },
      style: { width: 250 },
    };
  });
  
  // Create edges based on flowEdges
  const flowchartEdges = flowEdges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.fromCourseId,
    target: edge.toRoleId,
    type: "smoothstep",
    label: edge.rationale,
    labelStyle: { fontSize: 10 },
    labelBgStyle: { fill: '#f0f0f0', fillOpacity: 0.8 },
  }));
  
  return {
    nodes: [...courseNodes, ...roleNodes],
    edges: flowchartEdges
  };
}

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
    
    // Generate proper flowchart layout
    const graph = generateFlowchartLayout(
      recommendations.courses,
      recommendations.roles,
      recommendations.flowEdges
    );

    return res.json({
      ...recommendations,
      graph,
    });
  } catch (err) {
    console.error("Recommendation error:", err?.message);
    return res.status(500).json({ message: "Failed to generate recommendations" });
  }
};