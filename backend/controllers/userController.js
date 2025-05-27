// controllers/userController.js
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, isMusicTeacher } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    isMusicTeacher: isMusicTeacher || false,
  });

  if (user) {
    res.status(201).json({
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isMusicTeacher: user.isMusicTeacher,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isMusicTeacher: user.isMusicTeacher,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});
