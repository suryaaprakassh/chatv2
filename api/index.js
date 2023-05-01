const express = require("express");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const cors = require("cors");

const ws = require("ws");

const app = express();

const cookieParser = require("cookie-parser");

const bcrypt = require("bcryptjs");

const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const MessageModel = require("./models/MessageModel");

const bcryptSalt = bcrypt.genSaltSync(10);

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

app.use(cookieParser());

const jwtsec = process.env.JWT;

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtsec, {}, (err, userdata) => {
      if (err) throw err;
      res.json(userdata);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    console.log(createdUser);
    jwt.sign(
      { userId: createdUser._id, username },
      jwtsec,
      { sameSite: "none", secure: true },
      (err, token) => {
        if (err) throw error;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            _id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtsec,
        {},
        (err, token) => {
          res.cookie("token", token).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

const server = app.listen(5000);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenString) {
      const token = tokenString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtsec, {}, (err, data) => {
          if (err) throw err;
          const { userId, username } = data;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    if (messageData.message.recepient && messageData.message.text) {
      const messageDoc = await MessageModel.create({
        sender: connection.userId,
        recepient: messageData.message.recepient,
        text: messageData.message.text,
      });

      [...wss.clients]
        .filter((p) => p.userId == messageData.message.recepient)
        .forEach((lavada) => {
          lavada.send(
            JSON.stringify({
              text: messageData.message.text,
              sender: connection.userId,
              recepient: messageData.message.recepient,
              id: messageDoc._id,
            })
          );
        });
    }
  });
});
