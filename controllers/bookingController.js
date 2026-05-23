const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const createBooking = async (req, res) => {
  try {
    const db = getDB();
    const { carId, startDate, endDate, userId, userName, userEmail } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).send({
        message: "Missing required booking details: carId, startDate, endDate",
      });
    }

    if (!ObjectId.isValid(carId)) {
      return res.status(400).send({
        message: "Invalid car ID format",
      });
    }

    // Verify car exists
    const car = await db.collection("cars").findOne({ _id: new ObjectId(carId) });
    if (!car) {
      return res.status(404).send({
        message: "Car not found",
      });
    }

    // Create booking object
    const newBooking = {
      carId: new ObjectId(carId),
      carModel: car.carModel || `${car.brand} ${car.model}`,
      carImage: car.imageUrl || car.image,
      dailyRentalPrice: Number(car.dailyRentalPrice),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: userId || "anonymous",
      userName: userName || "Anonymous Renter",
      userEmail: userEmail || "anonymous@example.com",
      status: "Confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert booking into database
    const result = await db.collection("bookings").insertOne(newBooking);

    // Increment booking count on the car listing
    await db.collection("cars").updateOne(
      { _id: new ObjectId(carId) },
      { 
        $inc: { bookingCount: 1 }
      }
    );

    res.status(201).send({
      message: "Booking confirmed successfully",
      bookingId: result.insertedId,
      booking: newBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send({
        message: "Missing required parameter: userId",
      });
    }

    const bookings = await db
      .collection("bookings")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
};
