const mongoose = require("mongoose");
const retry = require("retry");

const connectToMongoDB = () => {
  const operation = retry.operation({
    retries: 5,
    factor: 3,
    minTimeout: 1000,
    maxTimeout: 60000,
  });

  operation.attempt(() => {
    mongoose.connect(
      "mongodb://localhost:27017/database-name",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (operation.retry(err)) {
          console.error("MongoDB connection error. Retrying...");
          return;
        }

        if (err) {
          console.error("MongoDB connection failed after retries.");
          throw err;
        }

        console.log("Connected to MongoDB.");
      }
    );
  });
};

module.exports = connectToMongoDB;
