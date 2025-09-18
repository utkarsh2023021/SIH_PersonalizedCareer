// components/Recommendations.js
import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import API from "../api";
import "./Recommendations.css"; // We'll create a separate CSS file

// Custom node components
const CourseNode = ({ data }) => (
  <div className="custom-node course-node">
    <div className="node-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
    </div>
    <div className="node-content">
      <div className="node-title">{data.label}</div>
      <div className="node-subtitle">{data.meta.stream}</div>
      <div className="node-level">{data.meta.level}</div>
    </div>
  </div>
);

const RoleNode = ({ data }) => (
  <div className="custom-node role-node">
    <div className="node-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
    <div className="node-content">
      <div className="node-title">{data.label}</div>
      <div className="node-description">{data.meta.description}</div>
    </div>
  </div>
);

const nodeTypes = {
  course: CourseNode,
  role: RoleNode,
};

const Recommendations = () => {
  // Academic information
  const [subjects, setSubjects] = useState([
    { name: "Mathematics", score: 75 },
    { name: "Science", score: 75 },
    { name: "Programming", score: 75 },
    { name: "Communication", score: 75 },
  ]);
  const [stream, setStream] = useState("");
  const [interests, setInterests] = useState([]);
  
  // Enhanced inputs
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [careerGoals, setCareerGoals] = useState("");
  const [preferredIndustries, setPreferredIndustries] = useState([]);
  const [learningStyle, setLearningStyle] = useState("self-paced");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Function to generate a proper flowchart layout
  const generateFlowchartLayout = useCallback((courses, roles, flowEdges) => {
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
        style: { width: 220 },
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
  }, []);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      // Convert subjects to scores object
      const scores = {};
      subjects.forEach(subject => {
        scores[subject.name.toLowerCase()] = subject.score;
      });

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
      const recommendations = data || {
        recommendedStreams: ["Computer Science", "Data Science"],
        courses: [
          {
            id: "intro-cs",
            title: "Introduction to Computer Science",
            stream: "Computer Science",
            level: "beginner",
          }
        ],
        roles: [
          {
            id: "software-dev",
            title: "Software Developer",
            description: "Develops software applications",
          }
        ],
        flowEdges: [
          {
            fromCourseId: "intro-cs",
            toRoleId: "software-dev",
            rationale: "Foundation for software development",
          }
        ],
        reasoning: "Based on your interest in programming and problem-solving skills.",
        graph: { nodes: [], edges: [] },
      };
      
      setResult(recommendations);
      
      // Generate proper flowchart layout
      const { nodes: layoutNodes, edges: layoutEdges } = generateFlowchartLayout(
        recommendations.courses,
        recommendations.roles,
        recommendations.flowEdges
      );
      
      setNodes(layoutNodes);
      setEdges(layoutEdges);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setResult({
        recommendedStreams: [],
        courses: [],
        roles: [],
        flowEdges: [],
        reasoning: "Error fetching recommendations. Please try again.",
        graph: { nodes: [], edges: [] },
      });
      
      // Reset nodes and edges on error
      setNodes([]);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler for updating subject scores
  const updateSubjectScore = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index].score = parseInt(value) || 0;
    setSubjects(newSubjects);
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

  // Add a new subject field
  const addSubject = () => {
    setSubjects([...subjects, { name: "", score: 50 }]);
  };

  // Update subject name
  const updateSubjectName = (index, name) => {
    const newSubjects = [...subjects];
    newSubjects[index].name = name;
    setSubjects(newSubjects);
  };

  // Remove a subject
  const removeSubject = (index) => {
    if (subjects.length <= 1) return;
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  return (
    <div className="recommendations-container">
      <header className="recommendations-header">
        <h1>Career Pathway Recommendations</h1>
        <p>Discover your ideal career path based on your skills and interests</p>
      </header>
      
      <div className="profile-section">
        <div className="section-header">
          <h2>Your Profile</h2>
          <div className="section-divider"></div>
        </div>
        
        {/* Academic Scores */}
        <div className="input-group">
          <label>Academic Scores (0-100)</label>
          <div className="subjects-container">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-input">
                <input
                  type="text"
                  placeholder="Subject name"
                  value={subject.name}
                  onChange={(e) => updateSubjectName(index, e.target.value)}
                  className="subject-name"
                />
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={subject.score}
                    onChange={(e) => updateSubjectScore(index, e.target.value)}
                    className="score-slider"
                  />
                  <span className="score-value">{subject.score}%</span>
                </div>
                <button 
                  onClick={() => removeSubject(index)}
                  className="remove-btn"
                  disabled={subjects.length <= 1}
                  aria-label="Remove subject"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button onClick={addSubject} className="add-subject-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Subject
          </button>
        </div>
        
        {/* Stream/Field of Study */}
        <div className="input-group">
          <label>Current/Preferred Stream/Field of Study</label>
          <input 
            type="text"
            placeholder="e.g., Computer Science, Data Science, Business"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="text-input"
          />
        </div>
        
        {/* Interests */}
        <div className="input-group">
          <label>Areas of Interest (Press Enter to add)</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text"
              placeholder="e.g., AI/ML, Web Development, UX Design"
              onKeyDown={addInterest}
              className="text-input"
            />
          </div>
          <div className="tags-container">
            {interests.map((interest, index) => (
              <span key={index} className="tag">
                {interest}
                <button 
                  onClick={() => removeInterest(index)}
                  className="tag-remove"
                  aria-label="Remove interest"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Experience Level */}
        <div className="input-group">
          <label>Current Experience Level</label>
          <div className="select-wrapper">
            <select 
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="select-input"
            >
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3+ years)</option>
            </select>
            <div className="select-arrow"></div>
          </div>
        </div>
        
        {/* Career Goals */}
        <div className="input-group">
          <label>Career Goals/Aspirations</label>
          <textarea 
            placeholder="Describe your career aspirations, e.g., 'I want to become a data scientist working in healthcare'"
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            rows="3"
            className="text-input"
          />
        </div>
        
        {/* Preferred Industries */}
        <div className="input-group">
          <label>Preferred Industries (Press Enter to add)</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <input 
              type="text"
              placeholder="e.g., Healthcare, Finance, E-commerce"
              onKeyDown={addIndustry}
              className="text-input"
            />
          </div>
          <div className="tags-container">
            {preferredIndustries.map((industry, index) => (
              <span key={index} className="tag">
                {industry}
                <button 
                  onClick={() => removeIndustry(index)}
                  className="tag-remove"
                  aria-label="Remove industry"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
        
        {/* Learning Style */}
        <div className="input-group">
          <label>Preferred Learning Style</label>
          <div className="select-wrapper">
            <select 
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              className="select-input"
            >
              <option value="self-paced">Self-paced online courses</option>
              <option value="structured">Structured university programs</option>
              <option value="bootcamp">Intensive bootcamps</option>
              <option value="mentorship">Mentorship-based learning</option>
            </select>
            <div className="select-arrow"></div>
          </div>
        </div>
      </div>

      <button 
        onClick={getRecommendations} 
        disabled={loading}
        className="recommendation-btn"
      >
        {loading ? (
          <>
            <div className="spinner"></div>
            Generating Recommendations...
          </>
        ) : (
          'Get Career Recommendations'
        )}
      </button>

      {result && (
        <div className="results-section">
          <div className="section-header">
            <h2>Your Career Pathway</h2>
            <div className="section-divider"></div>
          </div>
          
          {/* Streams */}
          <div className="result-group">
            <h3>Recommended Streams</h3>
            {result.recommendedStreams?.length > 0 ? (
              <div className="streams-container">
                {result.recommendedStreams.map((s, i) => (
                  <div key={i} className="stream-pill">{s}</div>
                ))}
              </div>
            ) : (
              <p className="no-data">No streams available.</p>
            )}
          </div>

          {/* Flowchart Visualization */}
          {nodes.length > 0 && (
            <div className="result-group">
              <h3>Career Pathway Flowchart</h3>
              <div className="flowchart-container">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <Controls />
                  <Background />
                  <MiniMap />
                </ReactFlow>
              </div>
              <div className="flowchart-legend">
                <div className="legend-item">
                  <div className="legend-color course-legend"></div>
                  <span>Course</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color role-legend"></div>
                  <span>Career Role</span>
                </div>
              </div>
            </div>
          )}

          {/* Courses */}
          <div className="result-group">
            <h3>Recommended Courses</h3>
            {result.courses?.length > 0 ? (
              <div className="courses-grid">
                {result.courses.map((c) => (
                  <div key={c.id} className="course-card">
                    <div className="course-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                    <div className="course-content">
                      <h4>{c.title}</h4>
                      <div className="course-details">
                        <span className="course-stream">{c.stream}</span>
                        <span className={`course-level ${c.level}`}>{c.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No courses found.</p>
            )}
          </div>

          {/* Roles */}
          <div className="result-group">
            <h3>Potential Career Roles</h3>
            {result.roles?.length > 0 ? (
              <div className="roles-grid">
                {result.roles.map((r) => (
                  <div key={r.id} className="role-card">
                    <div className="role-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="role-content">
                      <h4>{r.title}</h4>
                      <p>{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No roles found.</p>
            )}
          </div>

          {/* Reasoning */}
          <div className="result-group">
            <h3>Recommendation Reasoning</h3>
            <div className="reasoning-card">
              <p>{result.reasoning || "No reasoning provided."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;