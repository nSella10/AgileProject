// src/socket.js - Create App Socket Connection
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = ({ userId = null } = {}) => {
  console.log("🔍 getSocket called with userId:", userId);
  console.log("🔍 BASE_URL:", BASE_URL);
  console.log(
    "🔍 Current socket:",
    socket ? socket.id || "exists but no id" : "null"
  );

  if (!socket || socket.disconnected) {
    console.log("🔄 Creating new socket connection...");
    socket = io(BASE_URL, {
      withCredentials: true,
      auth: { userId }, // תמיד שלח auth עם userId (גם null)
    });

    // ✅ התחברות מוצלחת
    socket.on("connect", () => {
      console.log("✅ Socket connected!", socket.id);
      console.log("✅ Socket connected to:", BASE_URL);
    });

    // ❌ ניתוק
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      // לא נאפס את socket כאן כדי לאפשר reconnection
    });

    // 🛑 שגיאה בהתחברות
    socket.on("connect_error", (err) => {
      console.log("🚨 Socket connection error:", err.message);
      console.log("🚨 Failed to connect to:", BASE_URL);
    });
  } else {
    console.log("🔄 Reusing existing socket:", socket.id);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
