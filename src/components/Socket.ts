import { io } from "socket.io-client";

const getSocketUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'wss://fifarewardbackend.onrender.com';
  if (!url) {
    throw new Error("Socket URL is not defined in environment variables.");
  }
  return url;
};

const socket = io(getSocketUrl(), {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (err) => {
  console.error(`Connection error: ${err.message}`);
});

socket.on('reconnect_attempt', () => {
  console.log('Trying to reconnect...');
});

export default socket;
