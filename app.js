const dns = require("dns");
dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB, getDB } = require("./config/db");
const recentCarRoutes = require("./routers/recentCarRoutes");
const carRoutes = require("./routers/carRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use("/api/v1/recentcar", recentCarRoutes);
app.use("/api/v1/car", carRoutes);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
}
startServer();