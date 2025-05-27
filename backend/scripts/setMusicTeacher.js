// Script to set a specific user as music teacher
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const setMusicTeacher = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get email from command line argument
    const email = process.argv[2];
    if (!email) {
      console.log("Usage: node setMusicTeacher.js <email>");
      console.log("Available users:");
      const users = await User.find({}, { firstName: 1, lastName: 1, email: 1 });
      users.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
      });
      process.exit(1);
    }

    // Update the specific user
    const result = await User.updateOne(
      { email: email },
      { $set: { isMusicTeacher: true } }
    );

    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found`);
    } else if (result.modifiedCount === 0) {
      console.log(`User ${email} was already a music teacher`);
    } else {
      console.log(`Successfully set ${email} as music teacher`);
    }

    // Show updated user info
    const user = await User.findOne({ email }, { firstName: 1, lastName: 1, email: 1, isMusicTeacher: 1 });
    if (user) {
      console.log(`Updated user: ${user.firstName} ${user.lastName} (${user.email}): isMusicTeacher = ${user.isMusicTeacher}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error);
    process.exit(1);
  }
};

setMusicTeacher();
