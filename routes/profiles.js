const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/authMiddleware");
const User = require("../models/user");

// 4.	As a user, he can get his personal information:
router.get("/profiles", verifyToken, async (req, res) => {
  try {
    // Retrieve user information based on the token data
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's personal information
    const { username, email } = user;
    res.status(200).json({ username, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
