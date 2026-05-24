const { verifyToken, cookieOptions } = require("../utils/jwt");

function authenticate(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    console.warn("⚠️  No token found in cookies. Available cookies:", Object.keys(req.cookies || {}));
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    console.log("✅ User authenticated:", decoded.email);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.clearCookie("token", cookieOptions);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please sign in again.",
      });
    }

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = authenticate;
