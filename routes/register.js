const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/user");

// 1.	As a user, he can register an account with a username and password. This API should create the user account if they do not already exist in the system. Then the user will receive an email confirming his email address.

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create the user account.
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Sending a confirmation email (nodemailer should be configured for your SMTP server)
    const transporter = nodemailer.createTransport({
      service: "EmailService@mail.com",
      auth: {
        user: "YourEmailAddress",
        pass: "YourEmailPassword",
      },
    });

    const mailOptions = {
      from: "your@email.com",
      to: email,
      subject: "Registration Confirmation",
      text: "Thank you for registering with our service!",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.sendStatus(204); //No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
