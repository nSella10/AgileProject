// src/socket.js
import { io } from "socket.io-client";

let socket;

export const initializeSocket = (userId) => {
  if (!userId) return;

  socket = io("http://10.0.0.8:8000", {
    auth: {
      userId,
    },
    withCredentials: true,
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
