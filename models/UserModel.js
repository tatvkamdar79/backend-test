const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

// Define the schema for the Example model
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", UserSchema);

// Export the Example model
module.exports = User;
