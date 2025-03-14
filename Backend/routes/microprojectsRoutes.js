import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define MicroProject Schema
const microProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  postedBy: String, // Store user ID or email
  bids: [{ bidder: String, amount: Number }], // List of bids
});

const MicroProject = mongoose.model("microprojects", microProjectSchema); // Using "microprojects" collection

// ✅ API to Post a New MicroProject
router.post("/microprojects", async (req, res) => {
  try {
    const { title, description, postedBy } = req.body;
    const newMicroProject = new MicroProject({ title, description, postedBy, bids: [] });
    await newMicroProject.save();
    res.status(201).json(newMicroProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Get All MicroProjects
router.get("/microprojects", async (req, res) => {
  try {
    const microprojects = await MicroProject.find();
    res.json(microprojects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Get MicroProjects Posted by a Specific User
router.get("/my-microprojects/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const microprojects = await MicroProject.find({ postedBy: userId });
    res.json(microprojects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Place a Bid on a MicroProject
router.post("/microprojects/:id/bid", async (req, res) => {
  try {
    const { id } = req.params;
    const { bidder, amount } = req.body;

    const microproject = await MicroProject.findById(id);
    if (!microproject) return res.status(404).json({ message: "MicroProject not found" });

    microproject.bids.push({ bidder, amount });
    await microproject.save();

    res.json(microproject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
