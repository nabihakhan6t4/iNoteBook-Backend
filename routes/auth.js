const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser"); // Import middleware

const JWT_SECRET = "NABIHAISGOOD";

// ✅ Route to create a new user: POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Name must be at least 3 characters long").isLength({
      min: 3,
    }),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false; // Default false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success,
            error: "Sorry, a user with this email already exists",
          });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET);

      success = true; // Set success to true if user is created successfully
      res.json({ success, authToken, message: "User created successfully!" });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .json({
          success,
          error: "Internal Server Error: Something went wrong",
        });
    }
  }
);

// ✅ Route to authenticate a user: POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Cannot be Blank").exists(),
  ],
  async (req, res) => {
    let success = false; // Use let instead of const

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET);

      success = true; // Change value here
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error: Something went wrong");
    }
  }
);

// ✅ Route to get user details: POST "/api/auth/getuser" - Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from middleware
    const user = await User.findById(userId).select("-password"); // Exclude password
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error: Something went wrong");
  }
});

module.exports = router;



