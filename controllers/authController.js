const { getDB } = require("../config/db");
const { verifyPassword } = require("@better-auth/utils/password");
const { signToken, cookieOptions } = require("../utils/jwt");
const { findUserById, findAccountByUserId, normalizeUser } = require("../utils/findUser");

function setAuthCookie(res, user) {
  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  res.cookie("token", token, cookieOptions);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const db = getDB();
    const rawUser = await db.collection("user").findOne({
      email: email.trim().toLowerCase(),
    });

    if (!rawUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = normalizeUser(rawUser);
    const account = await findAccountByUserId(db, user.id);

    if (!account?.password) {
      return res.status(401).json({
        message: "This account uses social sign-in. Please sign in with Google.",
      });
    }

    const isValidPassword = await verifyPassword(account.password, password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const safeUser = setAuthCookie(res, user);

    res.json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Failed to sign in",
    });
  }
};

const syncToken = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const db = getDB();
    let user = await findUserById(db, userId);

    if (!user && email) {
      const byEmail = await db.collection("user").findOne({
        email: email.trim().toLowerCase(),
      });
      user = byEmail ? normalizeUser(byEmail) : null;
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const safeUser = setAuthCookie(res, user);

    res.json({
      message: "Token synced",
      user: safeUser,
    });
  } catch (error) {
    console.error("Sync token error:", error);
    res.status(500).json({
      message: "Failed to sync authentication",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  res.json({
    user: req.user,
  });
};

module.exports = {
  login,
  syncToken,
  logout,
  getMe,
};
