const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
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
      userId,
      userName,
      userEmail,
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
      userId: userId || null,
      userName: userName || "Anonymous",
      userEmail: userEmail || null,
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

const getCarById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid car ID format",
      });
    }

    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });

    if (!car) {
      return res.status(404).send({
        message: "Car not found",
      });
    }

    res.send(car);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch car details",
      error: error.message,
    });
  }
};

const getMyCars = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send({
        message: "Missing required parameter: userId",
      });
    }

    const cars = await db
      .collection("cars")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(cars);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch user cars",
      error: error.message,
    });
  }
};

const updateCar = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const {
      carModel,
      brand,
      model,
      dailyRentalPrice,
      availability,
      vehicleRegistrationNumber,
      features,
      description,
      imageUrl,
      image,
      location,
    } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid car ID format",
      });
    }

    const updateFields = {};
    if (carModel !== undefined) updateFields.carModel = carModel;
    if (brand !== undefined) updateFields.brand = brand;
    if (model !== undefined) updateFields.model = model;
    if (dailyRentalPrice !== undefined) updateFields.dailyRentalPrice = Number(dailyRentalPrice);
    if (availability !== undefined) updateFields.availability = availability === true || availability === "true";
    if (vehicleRegistrationNumber !== undefined) updateFields.vehicleRegistrationNumber = vehicleRegistrationNumber;
    if (features !== undefined) updateFields.features = features;
    if (description !== undefined) updateFields.description = description;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
    if (image !== undefined) updateFields.image = image;
    if (location !== undefined) updateFields.location = location;

    updateFields.updatedAt = new Date();

    const result = await db.collection("cars").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: "Car not found",
      });
    }

    res.send({
      message: "Car updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to update car",
      error: error.message,
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid car ID format",
      });
    }

    const result = await db.collection("cars").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Car not found",
      });
    }

    res.send({
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to delete car",
      error: error.message,
    });
  }
};

module.exports = {
  getCars,
  addCar,
  getCarById,
  getMyCars,
  updateCar,
  deleteCar,
};