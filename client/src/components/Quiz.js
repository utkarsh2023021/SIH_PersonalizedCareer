import React, { useState } from "react";
import api from "../api";

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic) return alert("Please enter a topic");
    setLoading(true);
    try {
      const { data } = await api.post("/quiz/generate", { topic, difficulty });
      setQuiz(data); // expecting array of { question, options, correctAnswer }
      setAnswers({});
      setResult(null);
    } catch (err) {
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIndex, selected) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: selected }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.length) {
      return alert("Please answer all questions before submitting.");
    }
    setLoading(true);
    try {
      const { data } = await api.post("/quiz/submit", {
        questions: quiz,
        answers: Object.values(answers),
      });
      setResult(data);
    } catch (err) {
      alert("Failed to evaluate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Take a Quiz</h2>

      {!quiz.length && (
        <div>
          <input
            placeholder="Enter topic (e.g. Science, Math)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={handleGenerateQuiz} disabled={loading} style={{ marginLeft: "10px" }}>
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>
      )}

      {quiz.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "600px", marginInline: "auto" }}>
          {quiz.map((q, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <strong>Q{i + 1}. {q.question}</strong>
              {q.options.map((option, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={option}
                      checked={answers[i] === option}
                      onChange={() => handleOptionChange(i, option)}
                    />{" "}
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button onClick={handleSubmit} disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results</h3>
          <p><strong>Score:</strong> {result.score}/{result.total}</p>
          <p><strong>Feedback:</strong> {result.feedback}</p>
        </div>
      )}
    </div>
  );
}
