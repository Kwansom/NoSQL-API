const mongoose = require("mongoose");
const User = require("./models/User");
const Thought = require("./models/Thought");

mongoose
  .connect("mongodb://localhost/socialNetworkDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const userData = [
  {
    username: "Sam_Iam",
    email: "sam@example.com",
  },
  {
    username: "James_Bond",
    email: "007@mi6.com",
  },
  {
    username: "K_W",
    email: "kw@example.com",
  },
];

const thoughtData = [
  {
    thoughtText: "Hello World",
    username: "Sam_Iam",
    reactions: [{ reactionBody: "Hello Sam!", username: "K_W" }],
  },
  {
    thoughtText: "Hmmm what's on my mind?",
    username: "K_W",
    reactions: [{ reactionBody: "Winning", username: "James_Bond" }],
  },
  {
    thoughtText: "Shaken not stirred",
    username: "James_Bond",
    reactions: [{ reactionBody: "What?", username: "Sam_Iam" }],
  },
];

const seedDatabase = async () => {
  try {
    // clears db
    await User.deleteMany({});
    await Thought.deleteMany({});

    const createdUsers = await User.create(userData);
    console.log(`Created ${createdUsers.length} users`);

    const createdThoughts = await Thought.create(thoughtData);
    console.log(`Created ${createdThoughts.length} thoughts`);

    for (let i = 0; i < createdUsers.length; i++) {
      createdUsers[i].thoughts.push(createdThoughts[i]._id);
      await createdUsers[i].save();
    }
    console.log("Seeded database successful");
  } catch (err) {
    console.log("Error with seeding", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
