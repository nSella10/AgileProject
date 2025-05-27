// Script to update existing users with isMusicTeacher field
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const updateExistingUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Update all users that don't have isMusicTeacher field
    const result = await User.updateMany(
      { isMusicTeacher: { $exists: false } },
      { $set: { isMusicTeacher: false } }
    );

    console.log(`Updated ${result.modifiedCount} users with isMusicTeacher field`);

    // Show all users for verification
    const users = await User.find({}, { firstName: 1, lastName: 1, email: 1, isMusicTeacher: 1 });
    console.log("All users:");
    users.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}): isMusicTeacher = ${user.isMusicTeacher}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error updating users:", error);
    process.exit(1);
  }
};

updateExistingUsers();
