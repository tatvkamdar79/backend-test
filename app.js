const express = require("express");
const app = express();
const db = require("./config/db");
const cors = require("cors");
const port = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const googleSheetsRoutes = require("./routes/googleSheetsRoutes");

app.get("/", (req, res) => {
  res.json({ live: true });
});

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/qr", qrCodeRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/googleSheets", googleSheetsRoutes);

// Start the server
module.exports = app;
