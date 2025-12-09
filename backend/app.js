// backend/app.js
const express = require("express");
const mongoose = require("mongoose");
const donationRoutes = require("./routes/donations"); // make sure this path is correct
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Temporary user for testing
app.use((req, res, next) => {
  req.user = { _id: "Y69207028d3d4f52e27cd06bc" }; // Replace with a valid ObjectId from your Atlas DB
  next();
});

// Routes
app.use("/api/donations", donationRoutes);

// MongoDB Atlas connection
const mongoURI = mongodb+srv://msandhya3005_db_user:9xDLHMGsWNmBG2r@cluster0.yublfwh.mongodb.net/?appName=Cluster0G_HERE; // Replace with your Atlas URI
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB connection error:", err));
