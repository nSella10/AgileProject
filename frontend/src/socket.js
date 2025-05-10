// src/getSocket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = ({ userId } = {}) => {
  if (!socket) {
    socket = io(BASE_URL, {
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
