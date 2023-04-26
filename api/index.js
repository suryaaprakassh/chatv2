const express = require("express");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const cors = require("cors");

const app = express();

const cookieParser=require("cookie-parser")

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

app.use(cookieParser())



const jwtsec = process.env.JWT;

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get('/profile',(req,res)=>{
  const token=req.cookies?.token;
  if(token){

  jwt.verify(token,jwtsec,{},(err,userdata)=>{
    if(err) throw err;
    res.json(userdata);
  })

  }else{
    res.status(401).json("no token")
  }
})


app.post("/register", async (req, res) => {
  console.log("running ");
  const { username, password } = req.body;
  try {
    const createdUser = await User.create({ username, password });
    console.log(createdUser);
    jwt.sign({ userId: createdUser._id ,username}, jwtsec, {}, (err, token) => {
      if (err) throw error;
      res.cookie("token", token,{sameSite:'none',secure:true}).status(201).json({
        _id: createdUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.listen(5000);
