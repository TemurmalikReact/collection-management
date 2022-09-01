const { Router } = require("express");
const router = Router();
const config = require("config");

const User = require("../modules/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// api/auth/register
router.post(
  "/register",
  [
    check("email", "Enter valid email").isEmail(),
    check("password", "Enter your password").isLength({ min: 1 }),
    check("userName", "Enter your user name").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data",
        });
      }

      const { userName, email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "This user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        userName,
        email,
        password: hashedPassword,
        isBlocked: false,
        role: ["USER"],
      });

      await user.save();

      const token = jwt.sign({ userId: user.id }, config.get("jwtKey"), {
        expiresIn: "24hr",
      });

      res.status(201).json({ message: "User created", token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

// api/auth/login
router.post(
  "/login",
  [
    check("email", "Enter valid email").normalizeEmail().isEmail(),
    check("password", "Enter your password").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const isBlocked = user.isBlocked;

      if (isBlocked) {
        return res
          .status(400)
          .json({ message: "User was blocked by someone else" });
      }

      await user.save();

      const token = jwt.sign({ userId: user.id }, config.get("jwtKey"), {
        expiresIn: "24hr",
      });

      res.json({
        email,
        token,
        userId: user.id,
        message: "You signed in succesfully",
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
