const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // remove any leading or trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Regex to validate email format
    },
    // Array of thoughts associated with the user, referencing Thought model
    thoughts: [
      {
        type: Schema.Types.ObjectId, // each thought is referenced by it's ObjectId
        ref: "Thought", // acts as foreign key to Thought model
      },
    ],
    // Array of friends (references to other users)
    friends: [
      {
        type: Schema.Types.ObjectId, // referenced by its ObjectId
        ref: "User", // acts as foreign key to User model (self-reference)
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, // Enables virtual fields in the output
    },
  }
);

// Virtual to get friend count
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Using mongooe.model() to compile a model based on the schema 'userSchema'
const User = mongoose.model("User", userSchema);
module.exports = User;
