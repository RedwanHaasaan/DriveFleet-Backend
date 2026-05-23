const { getCars, addCar, getCarById } = require("../controllers/carController");

const router = require("express").Router();

router.get("/", getCars);
router.post("/add-car", addCar);
router.get("/:id", getCarById);

module.exports = router;