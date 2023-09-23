require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();

app.use(cors());

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
