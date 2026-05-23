const router = require("express").Router();
const authenticate = require("../middleware/authMiddleware");
const {
  login,
  syncToken,
  logout,
  getMe,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/sync", syncToken);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

module.exports = router;
