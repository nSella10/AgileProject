// src/socket.js - Play App Socket Connection
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = ({ userId = null } = {}) => {
  if (!socket) {
    socket = io(BASE_URL, {
      withCredentials: true,
      auth: { userId }, // תמיד שלח auth עם userId (גם null)
    });

    // ✅ התחברות מוצלחת
    socket.on("connect", () => {
      console.log("✅ Socket connected!", socket.id);
    });

    // ❌ ניתוק
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    // 🛑 שגיאה בהתחברות
    socket.on("connect_error", (err) => {
      console.log("🚨 Socket connection error:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
