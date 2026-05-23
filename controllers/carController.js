const { getDB } = require("../config/db");

const getCars = async (req, res) => {
  try {
    const db = getDB();

    const {
      search,
      location,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Query Object
    const query = {};

    // Search
    if (search) {
      query.$or = [
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
        {
          model: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Location Filter
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.dailyRentalPrice = {};

      if (minPrice) {
        query.dailyRentalPrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.dailyRentalPrice.$lte = Number(maxPrice);
      }
    }

    // Sorting
    const sortOptions = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const cars = await db
      .collection("cars")
      .find(query)
      .sort(sortOptions)
      .toArray();

    res.send(cars);

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch cars",
    });
  }
};

module.exports = {
  getCars,
};