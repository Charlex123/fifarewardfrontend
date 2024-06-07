import { io } from "socket.io-client";

const getApiUrl = (): string => {
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL
      : process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return url.replace(/^http/, 'ws');
};

const socket = io(getApiUrl(), {
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
