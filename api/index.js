const express = require("express");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const cors = require("cors");

const app = express();

const UserModel = require("./");

const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT,
  })
);
app.use(express.json());
try {
  mongoose.connect(process.env.MONGO);
} catch (err) {
  if (err) throw err;
}

const jwtsec = process.env.JWT;

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  console.log("running ");
  const { username, password } = req.body;
  try {
    const createdUser = await User.create({ username, password });
    console.log(createdUser);
    jwt.sign({ userId: createdUser._id }, jwtsec, {}, (err, token) => {
      if (err) throw error;
      res.cookie("token", token).status(201).json("ok");
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.listen(5000);
