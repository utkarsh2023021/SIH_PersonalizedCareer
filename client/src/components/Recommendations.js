// components/Recommendations.js
import React, { useState } from "react";
import API from "../api";

const Recommendations = () => {
  // Basic academic information
  const [scores, setScores] = useState({});
  const [stream, setStream] = useState("");
  const [interests, setInterests] = useState([]);
  
  // New inputs for enhanced recommendations
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [careerGoals, setCareerGoals] = useState("");
  const [preferredIndustries, setPreferredIndustries] = useState([]);
  const [learningStyle, setLearningStyle] = useState("self-paced");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/recommendations", { 
        scores, 
        stream,
        interests,
        experienceLevel,
        careerGoals,
        preferredIndustries,
        learningStyle
      });

      // Ensure we always have safe defaults
      setResult(
        data ?? {
          recommendedStreams: [],
          courses: [],
          roles: [],
          flowEdges: [],
          reasoning: "No recommendations available.",
          graph: { nodes: [], edges: [] },
        }
      );
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setResult({
        recommendedStreams: [],
        courses: [],
        roles: [],
        flowEdges: [],
        reasoning: "No recommendations available.",
        graph: { nodes: [], edges: [] },
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for adding interests
  const addInterest = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      setInterests([...interests, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  // Handler for removing interests
  const removeInterest = (index) => {
    const newInterests = [...interests];
    newInterests.splice(index, 1);
    setInterests(newInterests);
  };

  // Handler for adding industries
  const addIndustry = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      setPreferredIndustries([...preferredIndustries, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  // Handler for removing industries
  const removeIndustry = (index) => {
    const newIndustries = [...preferredIndustries];
    newIndustries.splice(index, 1);
    setPreferredIndustries(newIndustries);
  };

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
      <h2>Career Pathway Recommendations</h2>
      
      <div style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>Your Profile</h3>
        
        {/* Academic Scores */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Academic Scores (JSON format): 
          </label>
          <textarea 
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            placeholder='{"math": 90, "programming": 85, "communication": 70}'
            onChange={(e) => {
              try {
                setScores(JSON.parse(e.target.value));
              } catch (err) {
                console.error("Invalid JSON");
              }
            }}
          />
        </div>
        
        {/* Stream/Field of Study */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Current/Preferred Stream/Field of Study: 
          </label>
          <input 
            type="text"
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            placeholder="e.g., Computer Science, Data Science, Business"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          />
        </div>
        
        {/* Interests */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Areas of Interest (Press Enter to add):
          </label>
          <input 
            type="text"
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            placeholder="e.g., AI/ML, Web Development, UX Design"
            onKeyDown={addInterest}
          />
          <div style={{ marginTop: 8 }}>
            {interests.map((interest, index) => (
              <span 
                key={index} 
                style={{
                  display: 'inline-block',
                  backgroundColor: '#e0e0e0',
                  padding: '4px 8px',
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8
                }}
              >
                {interest}
                <button 
                  onClick={() => removeInterest(index)}
                  style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Experience Level */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Current Experience Level: 
          </label>
          <select 
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="beginner">Beginner (0-1 years)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </div>
        
        {/* Career Goals */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Career Goals/Aspirations: 
          </label>
          <textarea 
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, minHeight: 60 }}
            placeholder="Describe your career aspirations, e.g., 'I want to become a data scientist working in healthcare'"
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
          />
        </div>
        
        {/* Preferred Industries */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Preferred Industries (Press Enter to add):
          </label>
          <input 
            type="text"
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            placeholder="e.g., Healthcare, Finance, E-commerce"
            onKeyDown={addIndustry}
          />
          <div style={{ marginTop: 8 }}>
            {preferredIndustries.map((industry, index) => (
              <span 
                key={index} 
                style={{
                  display: 'inline-block',
                  backgroundColor: '#e0e0e0',
                  padding: '4px 8px',
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8
                }}
              >
                {industry}
                <button 
                  onClick={() => removeIndustry(index)}
                  style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Learning Style */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Preferred Learning Style: 
          </label>
          <select 
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value)}
          >
            <option value="self-paced">Self-paced online courses</option>
            <option value="structured">Structured university programs</option>
            <option value="bootcamp">Intensive bootcamps</option>
            <option value="mentorship">Mentorship-based learning</option>
          </select>
        </div>
      </div>

      <button 
        onClick={getRecommendations} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating Recommendations...' : 'Get Career Recommendations'}
      </button>

      {result && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          {/* Streams */}
          <h3>Recommended Streams</h3>
          {result.recommendedStreams?.length > 0 ? (
            <ul>
              {result.recommendedStreams.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p>No streams available.</p>
          )}

          {/* Courses */}
          <h3>Recommended Courses</h3>
          {result.courses?.length > 0 ? (
            <ul>
              {result.courses.map((c) => (
                <li key={c.id}>
                  <strong>{c.title}</strong> — {c.stream} — {c.level}
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses found.</p>
          )}

          {/* Roles */}
          <h3>Potential Career Roles</h3>
          {result.roles?.length > 0 ? (
            <ul>
              {result.roles.map((r) => (
                <li key={r.id}>
                  <strong>{r.title}</strong>: {r.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No roles found.</p>
          )}

          {/* Flow Edges */}
          <h3>Course → Career Pathway</h3>
          {result.flowEdges?.length > 0 ? (
            <ul>
              {result.flowEdges.map((e, idx) => (
                <li key={idx}>
                  <code>{e.fromCourseId}</code> → <code>{e.toRoleId}</code> —{" "}
                  {e.rationale}
                </li>
              ))}
            </ul>
          ) : (
            <p>No mappings available.</p>
          )}

          {/* Reasoning */}
          <h3>Recommendation Reasoning</h3>
          <p>{result.reasoning ?? "No reasoning provided."}</p>

          {/* Placeholder for future flowchart */}
          {/* Example:
              <ReactFlow nodes={result.graph.nodes} edges={result.graph.edges} fitView />
          */}
        </div>
      )}
    </div>
  );
};

export default Recommendations;