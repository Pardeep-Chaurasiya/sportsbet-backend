require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const port = process.env.PORT || 4000;
const app = express();

app.use(cors());

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
//     maxAge: 3600,
//   })
// );
app.use(express.json());
app.use("/api", authRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
