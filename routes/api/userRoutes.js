const express = require("express");
const User = require("../../models/User"); // Import the User
const Thought = require("../../models/Thought");
const router = express.Router(); // creating new router instance

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // fetch all users from db
    res.json(users); // return users as JSON
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user by id with thoughts and friends
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id) // find user by ID
      .populate("thoughts")
      .populate("friends");
    // fields from User schema
    if (!user) {
      return res.status(404).json({ message: "User not found" }); //
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // create new user from data from request body
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a user by id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Thought.deleteMany({ _id: { $in: user.thoughts } }); // Delete thoughts associated with the user
    res.json({ message: "User and their thoughts deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// FRIENDS ROUTE

// POST to add a new friend to user's friend list
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId); // find friend by ID
    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }
    user.friends.push(friend); // Add the friend to the user's friend list
    await user.save(); // save the updated user to db
    res.json({
      user: user,
      newFriend: {
        username: friend.username,
        friendId: friend._id,
      },
    }); // return updated user with detail
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a friend from user's friend list
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }
    user.friends.pull(friend); // remove friend from friend list
    await user.save(); // save
    res.json({
      user: user,
      removedFriend: {
        username: friend.username,
        friendId: friend._id,
      },
    }); // return
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
