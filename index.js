// Load environment variables
require("dotenv").config();

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

// Connect to MongoDB
connectToMongo();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env

// CORS setup
app.use(cors({ 
  origin: "https://nabihakhan6t4.github.io",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
