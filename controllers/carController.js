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

const addCar = async (req, res) => {
  try {
    const db = getDB();

    const {
      brand,
      model,
      year,
      location,
      dailyRentalPrice,
      transmission,
      fuelType,
      seats,
      image,
      description,
      availability,
    } = req.body;

    // Validation
    if (
      !brand ||
      !model ||
      !year ||
      !location ||
      !dailyRentalPrice ||
      !transmission ||
      !fuelType ||
      !seats
    ) {
      return res.status(400).send({
        message: "Missing required fields: brand, model, year, location, dailyRentalPrice, transmission, fuelType, seats",
      });
    }

    // Create car object
    const newCar = {
      brand,
      model,
      year: Number(year),
      location,
      dailyRentalPrice: Number(dailyRentalPrice),
      transmission,
      fuelType,
      seats: Number(seats),
      image: image || null,
      description: description || "",
      availability: availability !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await db.collection("cars").insertOne(newCar);

    res.status(201).send({
      message: "Car added successfully",
      carId: result.insertedId,
      car: newCar,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to add car",
      error: error.message,
    });
  }
};

module.exports = {
  getCars,
  addCar,
};