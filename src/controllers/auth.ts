import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";
import { UniqueConstraintError } from "sequelize";

interface payload {
  userId: number;
  email: string;
}

// Helper functions

// payload => jwt access token
const generateAccessToken = (payload: payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "83n89j9190j@4j", {
    expiresIn: "15d",
  });
};

// jwt access token => payload
const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "83n89j9190j@4j"
  ) as payload;
};

// request => User
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res
        .status(401)
        .json({ success: false, status_message: "token is missing" });
      return;
    }
    const [scheme, token] = authHeader.split(" ");
    if (!(scheme.toLowerCase() === "bearer" && token)) {
      res.status(403).json({ success: false, status_message: "invalid token" });
      return;
    }
    const { userId } = verifyAccessToken(token);
    res.locals.user = await User.findByPk(userId);
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};

export const postSignup = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({
      fullName: fullName,
      email: email,
      hashedPassword: hashedPassword,
    });
    res.status(201).json({
      success: true,
      status_message: "created user",
      results: {
        userId: user.id,
      },
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res
        .status(400)
        .json({ success: false, status_message: "user is already registered" });
    } else {
      console.log(err);
      res
        .status(500)
        .json({ success: false, status_message: "internal server error" });
    }
  }
};

export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res
        .status(404)
        .json({ success: false, status_message: "user not found" });
      return;
    }
    const hashedPassword = user.hashedPassword;
    const passwordVerify = await bcrypt.compare(password, hashedPassword);
    if (passwordVerify) {
      const token = generateAccessToken({ userId: user.id, email: user.email });
      res.status(200).json({
        success: true,
        status_message: "logged in user",
        results: {
          access_token: token,
          userId: user.id,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, status_message: "wrong password" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, status_message: "internal server error" });
  }
};
