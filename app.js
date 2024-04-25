require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

// auth routes
const authRoutes = require("./routes/authRoutes");
const mongoConnect = require("./database/db");

app.use("/oauth", authRoutes);

app.use("/", (req, res) => {
  res.send("Its working..");
});

mongoConnect()
  .then((result) => {
    console.log("Connected successfully|");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}|`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
