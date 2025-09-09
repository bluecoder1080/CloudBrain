import express from "express";
import { ContentModel, LinkModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserMiddleware } from "./middleware.js";
import { random } from "./utils/random.js";

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
app.delete("/api/v1/content", UserMiddleware, async (req, res) => {
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

// Share the content
app.post("/api/v1/share", UserMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    await LinkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash: random(10),
    });
  } else {
    await LinkModel.deleteOne({
      //@ts-ignore
      userId: req.userId,
    });
  }
  res.json({
    message: "Updated Shared Link !",
  });
});

//Get The Link
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;
  res.json({
    message: "Hash has been fetched Successfully !",
  });

  const link = await LinkModel.findOne({
    hash,
  });
  if (!link) {
    res.status(411).json({
      message: "wrong input !",
    });
  }
  const user = UserModel.findOne({
    //@ts-ignore
    userId: link.userId,
  });
  if (!user) {
    res.status(411).json({
      message: "User Does NOt Exist !",
    });
    return;
  }
  res.json({
    //@ts-ignore
    username: user.username,
    //@ts-ignore
    content: content,
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
