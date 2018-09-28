require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

// set up server
const server = express();
const originUrl =
  process.env.NODE_ENV === "production"
    ? `https://true-business.netlify.com/`
    : `http://localhost:3000`;
const corsOptions = {
  origin: originUrl,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// set up middlewares
server.use(cors(corsOptions));
server.use(helmet());
server.use(express.urlencoded({ extended: false }));
server.use(morgan("dev"));
server.use(passport.initialize());
server.use(express.json());

const authRoutes = require("./routes/authRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");

mongoose
  .connect(
    process.env.DB_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log("Error connecting to the database");
  });

server.get("/", (req, res) => {
  res.status(200).json("Server running");
});

// set up routes
server.use("/auth", authRoutes);
server.use("/subscriber", subscriberRoutes);

// Catch-all error handler
server.use((err, req, res) => {
  res.status(500).send({ err });
});

//Status server
const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
