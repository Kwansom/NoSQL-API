const express = require("express");
const Thought = require("../../models/Thought"); // Import the Thought model
const User = require("../../models/User");
const router = express.Router(); // creating new router instance

// GET all thoughts
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by _id
router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Post to create new thought connected with a user
router.post("/", async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: newThought._id }, // Add the new thought ID to the user's thoughts
    });
    res.status(201).json(newThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a thought by _id
router.put("/:id", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); // update the thought data
    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE thought
router.delete("/:id", async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id); //delete thought by ID
    if (!deletedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json({ message: "Thought deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// REACTION

// POST to create a reaction to a thought
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    thought.reactions.push(req.body); // add new reaction
    await thought.save();
    res.status(201).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a reaction from a thought
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    thought.reactions = thought.reactions.filter(
      (reaction) => !reaction.reactionId.equals(req.params.reactionId)
    ); // remove reaction by reaction ID
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
