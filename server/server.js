const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
connectDB();

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
const routes = require("./routes");
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
