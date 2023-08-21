const mongoose = require("mongoose");

// Connect to the MongoDB instance
mongoose.connect("mongodb://localhost:27017/HyderabadHardware", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event listeners for connection status
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to the database.");
});

// Export the mongoose connection
module.exports = db;
