const {
  createBooking,
  getMyBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const router = require("express").Router();

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
