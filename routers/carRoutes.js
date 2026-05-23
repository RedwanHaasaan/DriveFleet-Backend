const {
  getCars,
  addCar,
  getCarById,
  getMyCars,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

const router = require("express").Router();

router.get("/", getCars);
router.post("/add-car", addCar);
router.get("/my-cars", getMyCars);
router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

module.exports = router;