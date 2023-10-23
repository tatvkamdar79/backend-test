const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const db = require("./config/db");
const cors = require("cors");
const port = 8080;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("images"));

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const googleSheetsRoutes = require("./routes/googleSheetsRoutes");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin (not recommended in production)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.json({ live: true, lol: false });
});

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/qr", qrCodeRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/googleSheets", googleSheetsRoutes);

const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

const server = https.createServer(options, app);

const PORT = 8080;
const LOCAL_IP = "192.168.0.109";

server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});

// // Start the server
// module.exports = app;
