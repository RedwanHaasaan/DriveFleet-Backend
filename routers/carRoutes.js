const {
  getCars,
  addCar,
  getCarById,
  getMyCars,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const authenticate = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/", getCars);
router.get("/my-cars", authenticate, getMyCars);
router.get("/:id", getCarById);

router.post("/add-car", authenticate, addCar);
router.put("/:id", authenticate, updateCar);
router.delete("/:id", authenticate, deleteCar);

module.exports = router;