const { getDB } = require("../config/db");

exports.getAllRecentCars = async (req, res) => {
  try {
    const db = getDB();
    
    // Fetch latest 6 cars from the "cars" collection sorted by newest first
    const recentCars = await db
      .collection("cars")
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.status(200).json(recentCars);
  } catch (error) {
    console.error("Error in getAllRecentCars:", error);
    res.status(500).json({
      message: "Failed to fetch recent cars",
      error: error.message,
    });
  }
};