const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const ObjectId = mongoose.Types.ObjectId;

const createRepository = async (req, res) => {
  const { name, issues, description, content, visibility, owner } = req.body;

  if (!name || !visibility || !owner) {
    return res
      .status(400)
      .json({ message: "Name, visibility, and owner are required" });
  }

  if (!ObjectId.isValid(owner)) {
    return res.status(400).json({ message: "Invalid owner ID format" });
  }

  try {
    const ownerId = new ObjectId(owner);
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newRepository = new Repository({
      name,
      description,
      content,
      visibility,
      owner: ownerId,
      issues: [],
    });

    const savedRepository = await newRepository.save();

    // Store the repo ID instead of the name
    user.repositories.push(savedRepository._id);
    await user.save();

    res.status(201).json(savedRepository);
  } catch (err) {
    console.error("Error creating repository:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllRepository = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ message: "No repositories found" });
    }
    res.status(200).json(repositories);
  } catch (err) {
    console.error("Error fetching repositories:", err);
    res.status(500).json({ message: err.message });
  }
};

const fetchRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID format" });
    }
    const repo = await Repository.findById(id)
      .populate("owner")
      .populate("issues");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repo);
  } catch (err) {
    console.error("Error fetching repository by ID:", err);
    res.status(500).json({ message: err.message });
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Repository name is required" });
    }

    const repo = await Repository.findOne({ name })
      .populate("owner")
      .populate("issues");

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json(repo);
  } catch (err) {
    console.error("Error fetching repository by name:", err);
    res.status(500).json({ message: err.message });
  }
};

const fetchRepositoriesForCurrentUser = async (req, res) => {
  const userId = req.params.userId; // ✅ From route: /repo/user/:userId

  try {
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const repo = await Repository.find({ owner: userId })
      .populate("owner")
      .populate("issues");

    if (!repo || repo.length === 0) {
      return res
        .status(404)
        .json({ message: "No repositories found for this user" });
    }
    res.status(200).json(repo);
  } catch (err) {
    console.error("Error fetching repositories for current user:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { name, description, content } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid repository ID" });
  }
  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (content) updateData.content = content;

    const updateRepo = await Repository.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("owner")
      .populate("issues");

    if (!updateRepo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(updateRepo);
  } catch (err) {
    console.error("Error updating repository:", err);
    res.status(500).json({ message: err.message });
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid repository ID" });
  }

  try {
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Toggle the boolean value
    repo.visibility = !repo.visibility;
    await repo.save();

    res.status(200).json({
      message: `Repository visibility changed to ${
        repo.visibility ? "public" : "private"
      }`,
      visibility: repo.visibility,
    });
  } catch (err) {
    console.error("Error toggling visibility:", err);
    res.status(500).json({ message: err.message });
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findByIdAndDelete(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Error deleting repository:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRepository,
  getAllRepository,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
