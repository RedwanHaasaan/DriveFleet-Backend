const dns = require("dns");
dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB, getDB } = require("./config/db");
const authRoutes = require("./routers/authRoutes");
const recentCarRoutes = require("./routers/recentCarRoutes");
const carRoutes = require("./routers/carRoutes");
const bookingRoutes = require("./routers/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Get frontend URL from environment or use default
const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const FRONTEND_URL = rawFrontendUrl.replace(/\/$/, "");

// CORS Configuration - Allow credentials from frontend
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recentcar", recentCarRoutes);
app.use("/api/v1/car", carRoutes);
app.use("/api/v1/booking", bookingRoutes);

async function startServer() {
  try {
    await connectDB();
    console.log(`CORS configured for: ${FRONTEND_URL}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
}
startServer();