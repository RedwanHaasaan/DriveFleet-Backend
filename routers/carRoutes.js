const { getCars, addCar } = require("../controllers/carController");

const router = require("express").Router();

router.get("/", getCars);
router.post("/add-car", addCar);

module.exports = router;