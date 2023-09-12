const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
// Get the MongoDB password from environment variables
const password = process.env.MONGODB_PASSWORD;
console.log(password);

// MongoDB Connection
mongoose
  .connect(
    `mongodb+srv://fadecapture:${password}@cluster1.ras3nsp.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// This is just a test route; it can removed or modified.
app.get("/api/register", async (req, res) => {
  res.status(200).json({ message: "GET Req received" });
});

// 1.	As a user, he can register an account with a username and password. This API should create the user account if they do not already exist in the system. Then the user will receive an email confirming his email address.
app.post("/api/register", async (req, res) => {
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
      service: "YourEmailService",
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

// 2.	The user who has already registered can login with the username and
app.post("/api/login", async (req, res) => {
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

// 3.	As a user, he can change his password.

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user; // Set the user in the request for further use
    next();
  });
};

app.post("/api/actions/changepassword", verifyToken, async (req, res) => {
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

// 4.	As a user, he can get his personal information:
app.get("/api/profiles", verifyToken, async (req, res) => {
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
