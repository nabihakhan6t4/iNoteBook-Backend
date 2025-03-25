const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://khannabiha923:itx%40nabihakhan6t4@cluster0.r4gvu.mongodb.net/notebookDB?retryWrites=true&w=majority";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
