const User = require("../models/UserModel");
const { sendResponse, sendSuccess, sendError } = require("../utils/response");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username, password: password });
  if (user) {
    sendResponse(res, "Logged In successfully", user, true);
  } else {
    sendResponse(res, "Invalid Credentials", {}, false);
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({});
  sendSuccess(res, "All Users", users);
};

exports.addUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return sendError(res, "Please Fill All Fields");
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    try {
      const newUser = new User({ username, password });
      await newUser.save();
      return sendSuccess(res, "User Saved Successfully", newUser);
    } catch (error) {
      return sendError(res, "Database Error", error);
    }
  } else {
    return sendError(res, "User Already Exists");
  }
};

exports.deleteUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return sendError(res, "Please Fill All Fields");
  }
  const user = await User.findOne({ username: username, password: password });
  if (user) {
    try {
      await user.deleteOne();
      return sendSuccess(res, "User deleted successfully");
    } catch (error) {
      return sendError(res, "Database Error", error);
    }
  }
};
