const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/authMiddleware");
const User = require("../models/user");

// 3.	As a user, he can change his password.
router.post("/actions/changepassword", verifyToken, async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    // Validate the user based on the token data
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check if the old password matches the stored password.
    const isPasswordValid = user.password === old_password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Update the user;s password with new one.
    user.password = new_password;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " Internal Server Error" });
  }
});

module.exports = router;
