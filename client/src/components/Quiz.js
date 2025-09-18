import React, { useState } from "react";
import api from "../api";
import "./Quiz.css"; // We'll create a separate CSS file for styling

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/quiz/generate", { topic, difficulty });
      setQuiz(data);
      setAnswers({});
      setResult(null);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIndex, selected) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: selected }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/quiz/submit", {
        questions: quiz,
        answers: Object.values(answers),
      });
      setResult(data);
    } catch (err) {
      setError("Failed to evaluate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuiz([]);
    setAnswers({});
    setResult(null);
    setError("");
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Take a Quiz</h2>
        <p>Test your knowledge on any topic</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!quiz.length && !result && (
        <div className="quiz-setup">
          <div className="input-group">
            <label htmlFor="topic-input">Quiz Topic</label>
            <input
              id="topic-input"
              placeholder="Enter topic (e.g. Science, Math, History)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="difficulty-select">Difficulty Level</label>
            <select 
              id="difficulty-select"
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <button 
            className="btn-primary"
            onClick={handleGenerateQuiz} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : "Generate Quiz"}
          </button>
        </div>
      )}

      {quiz.length > 0 && !result && (
        <div className="quiz-questions">
          <div className="quiz-progress">
            <span>Answered: {Object.keys(answers).length}/{quiz.length}</span>
          </div>
          
          {quiz.map((q, i) => (
            <div key={i} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {i + 1}</span>
                {answers[i] && <span className="answered-label">Answered</span>}
              </div>
              
              <strong className="question-text">{q.question}</strong>
              
              <div className="options-container">
                {q.options.map((option, idx) => (
                  <div 
                    key={idx} 
                    className={`option ${answers[i] === option ? 'selected' : ''}`}
                    onClick={() => handleOptionChange(i, option)}
                  >
                    <div className="option-selector">
                      <div className={`option-dot ${answers[i] === option ? 'active' : ''}`}></div>
                    </div>
                    <label className="option-label">{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="quiz-actions">
            <button className="btn-secondary" onClick={handleReset}>
              Start Over
            </button>
            <button 
              className="btn-primary"
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : "Submit Quiz"}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="quiz-results">
          <div className="result-card">
            <h3>Quiz Results</h3>
            
            <div className="score-circle">
              <span className="score-text">
                {result.score}<span className="score-total">/{result.total}</span>
              </span>
              <div className="score-percentage">
                {Math.round((result.score / result.total) * 100)}%
              </div>
            </div>
            
            <div className="score-feedback">
              <p><strong>Feedback:</strong> {result.feedback}</p>
            </div>
            
            <button className="btn-primary" onClick={handleReset}>
              Take Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}