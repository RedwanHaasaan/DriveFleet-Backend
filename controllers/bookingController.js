const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const createBooking = async (req, res) => {
  try {
    const db = getDB();
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;

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

    // Calculate days and total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const dailyPrice = Number(car.dailyRentalPrice);
    const totalPrice = days > 0 ? days * dailyPrice : dailyPrice;

    // Create booking object
    const newBooking = {
      carId: new ObjectId(carId),
      carModel: car.carModel || `${car.brand} ${car.model}`,
      carImage: car.imageUrl || car.image,
      location: car.location || "N/A",
      dailyPrice,
      days: days > 0 ? days : 1,
      totalPrice,
      startDate: start,
      endDate: end,
      userId,
      userName: userName || "Anonymous Renter",
      userEmail,
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
    const userId = req.user.id;

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

const updateBooking = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid booking ID format",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).send({
        message: "Missing required dates: startDate, endDate",
      });
    }

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).send({
        message: "Booking not found",
      });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).send({
        message: "You are not allowed to update this booking",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      return res.status(400).send({
        message: "End date must be after start date",
      });
    }

    const dailyPrice = Number(booking.dailyPrice);
    const totalPrice = days * dailyPrice;

    // Update booking in database
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          startDate: start,
          endDate: end,
          days,
          totalPrice,
          updatedAt: new Date(),
        },
      }
    );

    res.send({
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid booking ID format",
      });
    }

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return res.status(404).send({
        message: "Booking not found",
      });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).send({
        message: "You are not allowed to cancel this booking",
      });
    }

    // Delete booking from database
    await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    // Decrement booking count on the associated car
    await db.collection("cars").updateOne(
      { _id: booking.carId },
      {
        $inc: { bookingCount: -1 },
      }
    );

    res.send({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBooking,
  deleteBooking,
};
