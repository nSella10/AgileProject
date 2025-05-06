// src/socket.js
import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("userInfo"));

const socket = io("http://localhost:8000", {
  auth: {
    userId: user?._id, // זה נשלח לשרת בכל התחברות
  },
  withCredentials: true,
});

export default socket;
