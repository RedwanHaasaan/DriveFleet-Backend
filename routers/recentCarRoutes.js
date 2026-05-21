const { getAllRecentCars } = require("../controllers/RecentCarsController");

const router = require("express").Router();

router.get("/",getAllRecentCars)

module.exports=router