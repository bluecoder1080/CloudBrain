import express from "express";
import { UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// import mongoose from "mongoose";
const app = express();
// const JWT_PASSWORD = "heiei";
dotenv.config();
const JWT_PASSWORD = process.env.JWT_PASSWORD as string;

app.use(express.json());

//SIGNUP END POINT
app.post("/api/v2/signup", async (req, res) => {
  //Todo : zod validation, hash the password
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });
    res.json({
      message: "User Signed Up",
    });
  } catch (e) {
    res.status(411).json({
      message: "User Alreday Exists !!!",
    });
  }
});

//SIGNIN END POINT .
app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({ username, password });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

app.delete("/api/v2/content", (req, res) => {});
app.post("/api/v2/brain/share", (req, res) => {});
app.post("/api/v2/brain/:shareLink", (req, res) => {});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
