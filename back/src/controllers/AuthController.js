import User from "../models/User.js";
import { comparePassword } from "../utils/password.js";
import UserController from "./UserController.js";
import jwt from "jsonwebtoken";

async function login(req, res) {
  const { email, password } = req.body;
  console.log(" Login attempt for:", email);

  try {
    const user = await User.findOne({ where: { email } });
    console.log("User found:", !!user);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "365d" }
    );

    return res.status(200).json({
      message: "Login successful",
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}

function register(req, res) {
  UserController.createUser(req, res);
  // Envoi d'email
}

function checkToken(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by email from decoded token
    User.findOne({ where: { email: decoded.email } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        return res.status(200).json({
          email: user.email,
          id: user.id,
          username: user.username,
          role: user.role,
        });
      })
      .catch((error) => {
        return res.status(500).json({ error: "Database error" });
      });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default { login, register, checkToken };
