require("dotenv").config();
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const betRoutes = require("./routes/betRoute");
const walletRoute = require("./routes/walletRoute");
const withdrawalRoute = require("./routes/withdrawlRoute");
// const swarmRoutes = require("./routes/swarmRoutes");
require("./controllers/swarmFetchAndStoreData");

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
app.use("/api", walletRoute);
app.use("/api", withdrawalRoute);
// app.use("/api", swarmRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
