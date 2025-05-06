import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if cookie is in the request
  if (req.cookies && req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
