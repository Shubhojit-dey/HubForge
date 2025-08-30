import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import navigation
import "./CreateRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMessage("You must be logged in to create a repository.");
        setLoading(false);
        return;
      }

      const res = await axios.post("https://hubforge.onrender.com/repo/create", {
        name,
        description,
        content: [content], // wrap in array (because your model expects array)
        visibility,
        owner: userId,
      });

      if (res.status === 201) {
        setMessage("Repository created successfully!");
        setName("");
        setDescription("");
        setContent("");
        setVisibility(true);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error creating repository:", err);
      setMessage("Failed to create repository. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-repo-container">
      <h2>Create New Repository</h2>
      <form className="create-repo-form" onSubmit={handleSubmit}>
        <label>Repository Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter repository name"
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description"
        />

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Initial file/content (optional)"
        />

        <label>Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value === "true")}
        >
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Repository"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateRepo;
