// socket.ts
import { io } from "socket.io-client";

const SERVER = 'https://fifarewardbackend.onrender.com';
const socket = io(SERVER, { transports: ['websocket'] });

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
