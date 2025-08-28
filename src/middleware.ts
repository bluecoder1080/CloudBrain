import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_PASSWORD = process.env.JWT_PASSWORD as string;

export const UserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHrader = req.headers["authorization"];
  const token = authHrader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }
  const decoded = jwt.verify(token, JWT_PASSWORD);
  if (decoded) {
    //@ts-ignore
    req.userId = decoded.id;
  } else {
    res.status(403).json({
      message: "You are Not Logged In !!",
    });
  }
  next();
};
