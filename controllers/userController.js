const User = require("../models/UserModel");
const { sendResponse } = require("../utils/response");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username, password: password });
  if (user) {
    sendResponse(res, "Logged In successfully", user, true);
  } else {
    sendResponse(res, "Invalid Credentials", {}, false);
  }
};
