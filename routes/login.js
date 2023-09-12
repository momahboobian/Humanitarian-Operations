const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 2.	The user who has already registered can login with the username and
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists.
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the password is correct.
    const isPasswordValid = user.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate and respond with an access token.
    const accessToken = jwt.sign({ username }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ Token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
