const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "https://7thsemesterproject.vercel.app",         
    // origin: "http://localhost:5173",         
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const deliveryPartner = require("./routes/deliveryPartnerRoute");
//recommend
const recommendation = require("./routes/recommendRouter");
app.use("/api/v1", recommendation);

const rag = require("./routes/ragRoute");
app.use("/api/v1", rag);

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", deliveryPartner);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

// error middleware
app.use(errorMiddleware);

module.exports = app;
