import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI as string;
mongoose.connect(MONGODB_URI);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);
