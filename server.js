const https = require("https");
const fs = require("fs");

const app = require("./app");
const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};
const cf_options = {
  key: fs.readFileSync("cf-key.pem"),
  cert: fs.readFileSync("cf.pem"),
};

const server = https.createServer(cf_options, app);

const PORT = 8080;
const LOCAL_IP = "192.168.0.109";

server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});

// app.listen(8080, () => {
//   console.log("Server listening on port 8080");
// });
