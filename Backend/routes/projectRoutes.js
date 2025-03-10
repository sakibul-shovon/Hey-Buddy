import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create Project Model
const Project = mongoose.model('Project', projectSchema);

// POST route to submit a new project
router.post('/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: 'Project submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit project' });
  }
});

// GET route to fetch all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;