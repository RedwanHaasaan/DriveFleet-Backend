const jwt = require("jsonwebtoken");

const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

// Determine if we're in a secure context
const isProduction = process.env.NODE_ENV === "production";
const isSecureContext = process.env.SECURE_COOKIES === "true" || isProduction;

const cookieOptions = {
  httpOnly: true,
  secure: isSecureContext, // Only set to true if SECURE_COOKIES=true or NODE_ENV=production
  sameSite: isProduction ? "none" : "lax",
  maxAge: TOKEN_MAX_AGE_MS,
  path: "/",
};

module.exports = {
  signToken,
  verifyToken,
  cookieOptions,
};
