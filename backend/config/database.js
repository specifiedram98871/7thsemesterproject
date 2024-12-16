const mongoose = require("mongoose");

//cloud
const MONGO_URI = process.env.MONGO_URI;

//local env
// const MONGO_URI = "mongodb://localhost:27017/ecommerce";

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Mongoose Connected");
    });
};

module.exports = connectDatabase;
