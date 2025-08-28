import express from "express";
import { ContentModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserMiddleware } from "./middleware.js";

const app = express();

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

// POST THE CONTENT END POINT
app.post("/api/v1/content", UserMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;

  await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });
  return res.json({
    message: "Content Added !! ",
  });
});

// GET THE CONTENT END POINT
app.get("/api/v1/content", UserMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});



// DELETE THE CONTENT 
app.delete("/api/v1/content", UserMiddleware,  async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId: req.userId,
  });
  res.json({
    message: "Content deleted !",
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
