import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
// import { ref } from "process";
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI as string;
mongoose.connect(MONGODB_URI);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema)
