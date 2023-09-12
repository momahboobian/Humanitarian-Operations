const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
// Get the MongoDB password from environment variables
const password = process.env.MONGODB_PASSWORD;

// MongoDB Connection
mongoose
  .connect(
    `mongodb+srv://fadecapture:SZVLn3OwrcYvz9Hr@cluster1.ras3nsp.mongodb.net/?retryWrites=true&w=majority`,
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

// Import route components
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const changePasswordRoute = require("./routes/changepassword");
const profilesRoute = require("./routes/profiles");

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use the route components
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", changePasswordRoute);
app.use("/api", profilesRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging (you can customize this)

  // Handle different types of errors and send an appropriate response
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ error: "Bad request - JSON parsing error" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
