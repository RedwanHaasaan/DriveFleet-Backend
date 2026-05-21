const dns = require("dns");
dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB, getDB } = require("./config/db");
const recentCarRoutes = require("./routers/recentCarRoutes");


const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

app.use("/api/v1/recentcar", recentCarRoutes);

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