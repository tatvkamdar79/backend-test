const mongoose = require("mongoose");

// Connect to the MongoDB instance
// mongoose.connect("mongodb://localhost:27017/HyderabadHardware", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect("mongodb://tatv:tatv123@ac-pj6srpl-shard-00-00.yyqkb3m.mongodb.net:27017,ac-pj6srpl-shard-00-01.yyqkb3m.mongodb.net:27017,ac-pj6srpl-shard-00-02.yyqkb3m.mongodb.net:27017/?ssl=true&replicaSet=atlas-645zr9-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event listeners for connection status
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to the database.");
  console.log(db.collections);
});

// Export the mongoose connection
module.exports = db;
