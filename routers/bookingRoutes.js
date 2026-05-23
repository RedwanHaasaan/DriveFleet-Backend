const {
  createBooking,
  getMyBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const authenticate = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/", authenticate, createBooking);
router.get("/my-bookings", authenticate, getMyBookings);
router.put("/:id", authenticate, updateBooking);
router.delete("/:id", authenticate, deleteBooking);

module.exports = router;
