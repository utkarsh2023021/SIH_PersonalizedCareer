// utils/geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash-thinking-exp-01-21";

// Single client/model instance
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

// --- Internals ---

function stripCodeFences(text) {
  if (!text || typeof text !== "string") return "";
  return text.replace(/```json|```/gi, "").trim();
}

function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function callGemini(prompt, systemInstruction = null, expectJson = false) {
  try {
    const finalPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
    const contents = [{ role: "user", parts: [{ text: finalPrompt }] }];

    const res = await model.generateContent({
      contents,
      generationConfig: {
        responseMimeType: expectJson ? "application/json" : undefined,
      },
    });

    const text =
      res?.response?.text?.() ??
      res?.response?.text ??
      res?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    if (!text) {
      console.error("⚠️ Gemini returned no text.");
      return null;
    }

    const cleaned = stripCodeFences(typeof text === "function" ? await text() : text);

    if (expectJson) {
      const json = tryParseJSON(cleaned);
      if (!json) {
        console.error("⚠️ Invalid JSON from Gemini after cleaning:", cleaned);
        return null;
      }
      return json;
    }

    return cleaned;
  } catch (err) {
    console.error("❌ Gemini API Error:", err?.message);
    return null;
  }
}

// --- Public API ---

// Generate Quiz
export const generateQuiz = async (topic, difficulty) => {
  const system = "You are a quiz generator. Always respond with valid JSON only.";
  const prompt = `Generate exactly 3 multiple-choice questions about "${topic}" with difficulty "${difficulty}".
Return ONLY a JSON array of objects with this structure:
[
  { "question": "string", "options": ["opt1", "opt2", "opt3", "opt4"] },
  { "question": "string", "options": ["opt1", "opt2", "opt3", "opt4"] },
  { "question": "string", "options": ["opt1", "opt2", "opt3", "opt4"] }
]`;
  const data = await callGemini(prompt, system, true);
  return data ?? [
    { question: "Fallback Question: What is 2+2?", options: ["1", "2", "3", "4"] },
  ];
};

// Evaluate Quiz
export const evaluateQuiz = async (questions, answers) => {
  const system = "You are an answer evaluator. Always respond with valid JSON only.";
  const prompt = `Evaluate the answers:
Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}
Return ONLY JSON:
{ "score": number, "total": number, "feedback": "string" }`;
  const data = await callGemini(prompt, system, true);
  return data ?? { score: 0, total: questions.length, feedback: "Could not evaluate answers." };
};

// --- Recommendations with flowchart ---

function normalizeRecommendationPayload(payload) {
  const safe = {
    recommendedStreams: Array.isArray(payload?.recommendedStreams)
      ? payload.recommendedStreams.filter((s) => typeof s === "string")
      : [],
    courses: Array.isArray(payload?.courses)
      ? payload.courses
          .filter(
            (c) =>
              c &&
              typeof c.id === "string" &&
              typeof c.title === "string" &&
              typeof c.stream === "string" &&
              typeof c.level === "string"
          )
          .map((c) => ({
            id: c.id,
            title: c.title,
            stream: c.stream,
            level: c.level,
          }))
      : [],
    roles: Array.isArray(payload?.roles)
      ? payload.roles
          .filter(
            (r) =>
              r &&
              typeof r.id === "string" &&
              typeof r.title === "string" &&
              typeof r.description === "string"
          )
          .map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
          }))
      : [],
    flowEdges: Array.isArray(payload?.flowEdges)
      ? payload.flowEdges
          .filter(
            (e) =>
              e &&
              typeof e.fromCourseId === "string" &&
              typeof e.toRoleId === "string" &&
              typeof e.rationale === "string"
          )
          .map((e) => ({
            fromCourseId: e.fromCourseId,
            toRoleId: e.toRoleId,
            rationale: e.rationale,
          }))
      : [],
    reasoning: typeof payload?.reasoning === "string" ? payload.reasoning : "",
  };

  if (
    safe.recommendedStreams.length === 0 &&
    safe.courses.length === 0 &&
    safe.roles.length === 0
  ) {
    return {
      recommendedStreams: ["Computer Science"],
      courses: [
        {
          id: "c-intro-dsa",
          title: "Intro to Data Structures",
          stream: "Computer Science",
          level: "beginner",
        },
      ],
      roles: [
        {
          id: "r-se",
          title: "Software Engineer",
          description: "Builds and maintains software systems.",
        },
      ],
      flowEdges: [
        {
          fromCourseId: "c-intro-dsa",
          toRoleId: "r-se",
          rationale: "Foundational CS skills map to entry-level SWE roles.",
        },
      ],
      reasoning: "Default fallback recommendation.",
    };
  }

  const courseIds = new Set(safe.courses.map((c) => c.id));
  const roleIds = new Set(safe.roles.map((r) => r.id));
  safe.flowEdges = safe.flowEdges.filter(
    (e) => courseIds.has(e.fromCourseId) && roleIds.has(e.toRoleId)
  );

  return safe;
}

function buildRecommendationPrompt(
  scores, 
  stream, 
  interests, 
  experienceLevel, 
  careerGoals, 
  preferredIndustries, 
  learningStyle
) {
  return `
You are to produce ONLY JSON.

Input:
- Academic scores: ${JSON.stringify(scores)}
- Current/preferred stream: ${stream || "Not specified"}
- Areas of interest: ${JSON.stringify(interests)}
- Experience level: ${experienceLevel}
- Career goals: ${careerGoals || "Not specified"}
- Preferred industries: ${JSON.stringify(preferredIndustries)}
- Learning style preference: ${learningStyle}

Task:
1) Recommend 2-4 educational/career streams that align with the input profile
2) Propose 5-8 concrete courses with unique "id" that align to those streams and the user's experience level
3) Propose 4-6 target roles with unique "id" and brief description that match career goals and preferred industries
4) Create a flowEdges array mapping course IDs to role IDs with a one-sentence rationale (course -> role)
5) Provide a detailed reasoning string explaining the mapping logic based on all inputs

Output JSON shape:
{
  "recommendedStreams": string[],
  "courses": [
    { "id": string, "title": string, "stream": string, "level": "beginner"|"intermediate"|"advanced" }
  ],
  "roles": [
    { "id": string, "title": string, "description": string }
  ],
  "flowEdges": [
    { "fromCourseId": string, "toRoleId": string, "rationale": string }
  ],
  "reasoning": string
}

Rules:
- Output valid JSON only, no markdown, no extra commentary.
- Course ids and role ids must be unique and referenced exactly in flowEdges.
- Consider experience level when recommending courses (beginner, intermediate, advanced).
- Align recommendations with career goals and preferred industries when provided.
- If interests include specific technologies/domains, include relevant pathways.
- Consider learning style preference when possible (e.g., recommend self-paced courses for self-paced learners).
`.trim();
}

export const getCareerRecommendations = async (
  scores, 
  stream = "", 
  interests = [], 
  experienceLevel = "beginner", 
  careerGoals = "", 
  preferredIndustries = [], 
  learningStyle = "self-paced"
) => {
  const system =
    "You are a career advisor. Return ONLY valid JSON conforming to the requested shape.";
  const prompt = buildRecommendationPrompt(
    scores, 
    stream, 
    interests, 
    experienceLevel, 
    careerGoals, 
    preferredIndustries, 
    learningStyle
  );
  const raw = await callGemini(prompt, system, true);
  return normalizeRecommendationPayload(raw);
};

export function toFlowchartGraph(reco) {
  const nodes = [
    ...reco.courses.map((c) => ({
      id: c.id,
      label: c.title,
      type: "course",
      meta: { stream: c.stream, level: c.level },
    })),
    ...reco.roles.map((r) => ({
      id: r.id,
      label: r.title,
      type: "role",
      meta: { description: r.description },
    })),
  ];
  const edges = reco.flowEdges.map((e, i) => ({
    id: `e-${i}`,
    source: e.fromCourseId,
    target: e.toRoleId,
    label: e.rationale,
  }));
  return { nodes, edges };
}

// --- Chat with LLM (restored) ---
export const chatWithLLM = async (message) => {
  const system = "You are a helpful AI assistant. Keep responses concise and clear.";
  const text = await callGemini(message, system, false);
  return text ?? "No response.";
};