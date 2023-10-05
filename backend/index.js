require("dotenv").config();
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const betRoutes = require("./routes/betRoute");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// app.use(express.static("uploads"));
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", betRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
