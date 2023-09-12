/*
const users = [
  const mongoose = require("mongoose");

// Define a User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create a Mongoose model for the User schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
*/

const users = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "hashed_password_1",
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "hashed_password_2",
  },
  // Add more dummy users as needed for testing
];

module.exports = {
  findOne: async (filter) => {
    return users.find((user) => user.email === filter.email);
  },
};
