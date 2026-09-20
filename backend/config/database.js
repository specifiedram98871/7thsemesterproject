const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to MongoDB:", MONGO_URI);

const connectDatabase = () => {
  mongoose.set("strictQuery", false);

  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("✓ MongoDB Connected Successfully");
    })
    .catch((err) => {
      console.error("✗ MongoDB Connection Failed:", err.message);
      console.error("Attempting to continue server startup anyway...");
    });
};

module.exports = connectDatabase;
