const { getCars } = require("../controllers/carController");

const router = require("express").Router();

router.get("/",getCars)

module.exports=router