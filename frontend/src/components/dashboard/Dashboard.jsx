import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestRepositories, setSuggestRepositories] = useState([]);
  const [serchResults, setSearchResults] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/auth";
      return;
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/repo/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    const fetchSuggestRepositories = async () => {
      try {
        const response = await fetch("http://localhost:8080/repo/all");
        if (!response.ok) {
          throw new Error("Failed to fetch suggested repositories");
        }
        const data = await response.json();
        setSuggestRepositories(data);
      } catch (error) {
        console.error("Error fetching suggested repositories:", error);
      }
    };

    fetchRepositories();
    fetchSuggestRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const handleStarRepo = async (repo) => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post("http://localhost:8080/user/toggleStar", {
        userId,
        repoId: repo._id,
      });

      // Toggle locally
      if (res.data.status === "starred") {
        setStarredRepos((prev) => [...prev, repo._id]);
      } else if (res.data.status === "unstarred") {
        setStarredRepos((prev) => prev.filter((id) => id !== repo._id));
      }
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchStarredRepos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/user/starredRepos/${userId}`
        );
        const starredRepoIds = res.data.starredRepos.map((repo) => repo._id); // store only IDs
        setStarredRepos(starredRepoIds);
      } catch (err) {
        console.error("Failed to fetch starred repos:", err);
      }
    };

    fetchStarredRepos();
  }, []);

  return (
    <section id="dashboard">
      <aside>
        <h3>Sugested Repositories</h3>
        {suggestRepositories.map((repo) => {
          const isStarred = starredRepos.includes(repo._id); // optional visual feedback

          return (
            <div key={repo._id} className="suggested-repo">
              <div className="repo-header">
                <h4>{repo.name}</h4>
                <FaStar
                  className={`star-icon ${isStarred ? "gold-star" : ""}`}
                  onClick={() => handleStarRepo(repo)}
                  title={isStarred ? "Unstar" : "Star"}
                />
              </div>
              <p>{repo.description}</p>
            </div>
          );
        })}
      </aside>
      <main>
        <h2>Your Repositories</h2>
        <div className="search">
          <input
            style={{
              backgroundColor: "#242424",
              padding: "10px 40px",
              borderRadius: "5px",
              color: "#fff",
            }}
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {serchResults.map((repo) => {
          return (
            <div key={repo._id}>
              <h4>{repo.name}</h4>
              <p>{repo.description}</p>
            </div>
          );
        })}
        <div className="upcoming-events">
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15,2025</p>
            </li>
            <li>
              <p>Developers Meetup - Oct 18,2025</p>
            </li>
            <li>
              <p>Hub_Forge New Update - Jan 1,2026</p>
            </li>
          </ul>
        </div>
      </main>
    </section>
  );
};

export default Dashboard;
