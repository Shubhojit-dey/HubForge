import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [editingRepo, setEditingRepo] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDesc, setUpdatedDesc] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      window.location.href = "/auth";
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/userProfile/${userId}`
        );

        // If API returns { user: {...} }
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    const fetchRepositories = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/repo/user/${userId}`
        );
        setRepositories(res.data);
      } catch (err) {
        console.error("Failed to fetch repositories:", err);
      }
    };

    fetchUserProfile();
    fetchRepositories();
  }, []);

  // Handle Update Repo
  const handleUpdateRepo = async (repoId) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/repo/update/${repoId}`,
        {
          name: updatedName,
          description: updatedDesc,
        }
      );
      setRepositories((prev) =>
        prev.map((repo) => (repo._id === repoId ? res.data : repo))
      );
      setEditingRepo(null); // close edit mode
    } catch (err) {
      console.error("Failed to update repo:", err);
    }
  };

  // Handle Delete Repo
  const handleDeleteRepo = async (repoId) => {
    try {
      await axios.delete(`http://localhost:8080/repo/delete/${repoId}`);
      setRepositories((prev) => prev.filter((repo) => repo._id !== repoId));
    } catch (err) {
      console.error("Failed to delete repo:", err);
    }
  };

  return (
    <div className="profile-container">
      {user && <h2>Hello, {user.username} 👋</h2>}
      <h3>Your Repositories</h3>
      <div className="repo-list">
        {repositories.length === 0 ? (
          <p>No repositories found. Create one!</p>
        ) : (
          repositories.map((repo) => (
            <div key={repo._id} className="repo-card">
              {editingRepo === repo._id ? (
                <>
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    placeholder="Update name"
                  />
                  <textarea
                    value={updatedDesc}
                    onChange={(e) => setUpdatedDesc(e.target.value)}
                    placeholder="Update description"
                  />
                  <button onClick={() => handleUpdateRepo(repo._id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingRepo(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>
                  <div className="repo-actions">
                    <button
                      onClick={() => {
                        setEditingRepo(repo._id);
                        setUpdatedName(repo.name);
                        setUpdatedDesc(repo.description);
                      }}
                    >
                      Update
                    </button>
                    <button onClick={() => handleDeleteRepo(repo._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
