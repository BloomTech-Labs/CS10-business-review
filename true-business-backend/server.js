require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyparser = require("body-parser");
<<<<<<< HEAD
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
=======

//Instantiate Server
const server = express();

//Bringin Mongoose Database
const mongoose = require("mongoose");

//Bringing the route
const routes = require("./routes");

//Database name
const db = "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness";

//Connect Database
mongoose
  .connect(db)
  .then(() => console.log("\n=== connected to mongo ===\n"))
  .catch(err => console.log("database is not connected"));

//Security
server.use(helmet());

//Permissions
server.use(cors());

//Enable to parse Json object
server.use(express.json());
server.use(bodyparser.json()); //express.jason

server.use(express.json());
server.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.REACT_APP_COOKIEKEY]
  })
);
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
server.use(passport.initialize());
server.use(express.json());

<<<<<<< HEAD
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
=======
//Connect the route to the server
server.use("/", routes);

server.use(require("body-parser").text());
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796

//Status server
const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
