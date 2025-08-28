import React, { useState, useEffect } from "react";
import "./StaredRepo.css";

function StaredRepo() {
  const [starredRepos, setStarredRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/auth";
      return;
    }

    const fetchStarredRepos = async () => {
      try {
        const response = await fetch(`http://localhost:8080/starredRepos/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch starred repositories");
        }
        const data = await response.json();
        setStarredRepos(data.starred);
      } catch (error) {
        console.error("Error fetching starred repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStarredRepos();
  }, []);

  if (loading) return <p>Loading starred repositories...</p>;

  return (
    <div className="staredrepo-dashboard">
      <div className="starred-container">
        <h2 className="starred-title">Starred Repositories</h2>
        {Array.isArray(starredRepos) && starredRepos.length === 0 ? (
          <p>No starred repositories found.</p>
        ) : (
          starredRepos.map((repo) => (
            <div className="repo-card" key={repo._id || repo.name}>
              <h3>{repo.name}</h3>
              <p>Description: {repo.description || "No description available."}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StaredRepo;
