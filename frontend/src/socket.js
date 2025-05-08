// src/getSocket.js
import { io } from "socket.io-client";

let socket = null;

export const getSocket = ({ userId } = {}) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      withCredentials: true,
      auth: userId ? { userId } : undefined,
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
