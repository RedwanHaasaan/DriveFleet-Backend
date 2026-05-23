const { verifyToken, cookieOptions } = require("../utils/jwt");

function authenticate(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
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
    next();
  } catch (error) {
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
