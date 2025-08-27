import express from "express";
import { UserModel } from "./db.js";

import mongoose from "mongoose";
const app = express();


app.use(express.json());


app.post("/api/v2/signup", async (req, res) => {
  //Todo : zod validation, hash the password
  const username = req.body.username;
  const password = req.body.password;

  try{
  await UserModel.create({
    username: username,
    password: password,
  });
  res.json({
    message: "User Signed Up",
  });
  }catch(e){
  res.status(411).json({
    message : "User Alreday Exists !!!"
  })
}
});

app.post("/api/v1/signin", (req, res) => {});
app.delete("/api/v2/content", (req, res) => {});
app.post("/api/v2/brain/share", (req, res) => {});
app.post("/api/v2/brain/:shareLink", (req, res) => {});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

