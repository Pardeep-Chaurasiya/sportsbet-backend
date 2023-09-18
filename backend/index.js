const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const sequelize = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", authRoutes);

const PORT = process.env.PORT;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
