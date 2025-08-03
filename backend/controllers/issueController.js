const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const ObjectId = mongoose.Types.ObjectId;

const createIssue = async(req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    if (!title || !description) {
      return res.status(400).send("Title and description are required");
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid repository ID");
    }

    const issue = await new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    res.status(201).json({
      message: "Issue was created",
      issue,
    });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid issue ID");
  }

  if (!title && !description && !status) {
    return res.status(400).send("At least one field must be provided for update");
  }

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    const issue = await Issue.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("repository");

    if (!issue) {
      return res.status(404).send("Issue not found");
    }

    res.status(200).json({
      message: "Issue updated successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const deleteIssueById = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid issue ID");
  }

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).send("Issue not found");
    }

    res.status(200).json({
      message: "Issue deleted successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const getAllIssues = async(req, res) => {
  try{
    const issues = await Issue.find().populate("repository");
    res.status(200).json({
      message: "All issues retrieved successfully",
      issues,
    });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

const getIssueById = async(req, res) => {
  const { id } = req.params;
  try{
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid issue ID");
    }

    const issue = await Issue.findById(id).populate("repository");
    if (!issue) {
      return res.status(404).send("Issue not found");
    }
    res.status(200).json({
      message: "Issue retrieved successfully",
      issue,
    });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
