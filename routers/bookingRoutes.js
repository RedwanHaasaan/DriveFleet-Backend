const { createBooking, getMyBookings } = require("../controllers/bookingController");

const router = require("express").Router();

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);

module.exports = router;
