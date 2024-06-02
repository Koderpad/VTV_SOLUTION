import { io, Socket } from "socket.io-client";
import { send } from "vite";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (!token) return;
  const host = "localhost";
  const port = 8585;
  const url = `ws://${host}:${port}/ws-stomp?token=${token}`;
  socket = io(url, {
    transports: ["ws-stomp"],
  });
  console.log("socket: " + socket);
};


export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToRoomMessages = (roomChatId: string, callback: (message: any) => void) => {
  if (socket) {
    const roomUrl = `/room/${roomChatId}/chat?roomChatId=${roomChatId}`;
    socket.on(roomUrl, callback);
  }
};
export const sendMessage = (message: any, token: string) => {
  if (socket && socket.connected) {
    socket.send({
      destination: 'app/chat',
      body: message,
      headers: {
        Authorization: token,
      },
    });
  }
};
// export const sendMessage = (message: any) => {
//   if (socket) {
//     const sendUrl = '/app/chat';
//
//     socket.send({
//       sendUrl,
//       message
//     })
//   }
// };
