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

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/qr", qrCodeRoutes);

// Start the server
module.exports = app;
