
require("dotenv").config();

const mongoose = require("mongoose");

// Replace hardcoded URI with environment variable
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Reduce timeout to avoid long waits
      socketTimeoutMS: 45000,
      autoIndex: false, // Disable auto-indexing for performance
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectToMongo;
