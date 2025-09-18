import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Colleges.css";

const BASE_URL = "http://universities.hipolabs.com/search";

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ country: "India", type: "", stream: "" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("aurora");
  const [totalPages, setTotalPages] = useState(1);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          name: searchTerm || filters.stream,
          country: filters.country,
        },
      });
      
      let data = response.data;

      // Apply type filter if specified
      if (filters.type) {
        data = data.filter((college) =>
          college.name.toLowerCase().includes(filters.type.toLowerCase())
        );
      }

      // Calculate pagination
      const perPage = 9;
      const totalItems = data.length;
      setTotalPages(Math.ceil(totalItems / perPage));
      
      // Get current page items
      const paginated = data.slice((page - 1) * perPage, page * perPage);
      setColleges(paginated);
    } catch (err) {
      setError("Failed to fetch colleges. Please try again.");
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchColleges, 500);
    return () => clearTimeout(debounce);
  }, [fetchColleges]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="college-finder" data-theme={theme}>
      <header className="finder-header">
        <div className="header-content">
          <h1>India College Finder</h1>
          <p>Discover the perfect institution for your academic journey</p>
        </div>
        <div className="theme-switcher">
          <button 
            className={theme === "aurora" ? "active" : ""} 
            onClick={() => setTheme("aurora")}
            aria-label="Aurora theme"
          >
            <span className="theme-dot aurora-dot"></span>
            Aurora
          </button>
          <button 
            className={theme === "ocean" ? "active" : ""} 
            onClick={() => setTheme("ocean")}
            aria-label="Ocean theme"
          >
            <span className="theme-dot ocean-dot"></span>
            Ocean
          </button>
          <button 
            className={theme === "orchid" ? "active" : ""} 
            onClick={() => setTheme("orchid")}
            aria-label="Orchid theme"
          >
            <span className="theme-dot orchid-dot"></span>
            Orchid
          </button>
        </div>
      </header>

      <div className="search-filters-container">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by college name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label>Country</label>
            <select name="country" onChange={handleFilterChange} value={filters.country}>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select name="type" onChange={handleFilterChange} value={filters.type}>
              <option value="">Any Type</option>
              <option value="University">University</option>
              <option value="College">College</option>
              <option value="Institute">Institute</option>
              <option value="School">School</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Stream/Course</label>
            <input
              name="stream"
              placeholder="e.g., Engineering, Medicine"
              value={filters.stream}
              onChange={handleFilterChange}
              className="stream-input"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching colleges...</p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}

      {colleges.length > 0 ? (
        <>
          <div className="results-header">
            <h2>Found {colleges.length} Colleges</h2>
            <div className="view-toggle">
              <button className="view-btn active" aria-label="Grid view">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z" />
                  <path d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z" />
                  <path d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z" />
                  <path d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z" />
                </svg>
              </button>
              <button className="view-btn" aria-label="List view">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4C17 4.55228 16.5523 5 16 5H4C3.44772 5 3 4.55228 3 4Z" />
                  <path d="M3 8C3 7.44772 3.44772 7 4 7H16C16.5523 7 17 7.44772 17 8C17 8.55228 16.5523 9 16 9H4C3.44772 9 3 8.55228 3 8Z" />
                  <path d="M4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H4Z" />
                  <path d="M3 16C3 15.4477 3.44772 15 4 15H16C16.5523 15 17 15.4477 17 16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="college-grid">
            {colleges.map((college, index) => (
              <div 
                key={`${college.name}-${index}`} 
                className="college-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <div className="college-logo">
                    {college.name.charAt(0)}
                  </div>
                  <div className="college-name-container">
                    <h3>{college.name}</h3>
                    <span className="country-badge">{college.country}</span>
                  </div>
                </div>
                
                <div className="card-details">
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>{college["state-province"] || "Multiple locations"}</span>
                  </div>
                  
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                    </svg>
                    <a 
                      href={college.web_pages[0]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="website-link"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button className="save-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                    Save
                  </button>
                  <button className="details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="no-results">
            <div className="no-results-illustration">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h3>No colleges match your criteria</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={pageNum === page ? "active" : ""}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && page < totalPages - 2 && (
              <>
                <span className="ellipsis">...</span>
                <button onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}