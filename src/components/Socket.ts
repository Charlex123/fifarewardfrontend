// socket.ts
import { io } from "socket.io-client";

const API_URL = process.env.NODE_ENV === "production"
  ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL
  : process.env.NEXT_PUBLIC_API_URL;

const socket = io(API_URL, { transports: ['websocket'], withCredentials: true });

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`);
});

export default socket;
