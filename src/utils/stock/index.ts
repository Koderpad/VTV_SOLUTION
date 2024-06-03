import { Client, Stomp } from "@stomp/stompjs";
let stompClient: Client | null = null;
let isConnected = false;

export const initSocket = (
  token: string,
  roomChatId: string,
  callback: (mess: any) => void
) => {
  if (!token) return;
  const host = "localhost";
  const port = 8585;
  const url = `ws://${host}:${port}/ws-stomp?token=${token}`;
  stompClient = new Client({
    brokerURL: url,
    connectHeaders: {
      Authorization: token,
    },
    debug: function (str) {
      console.log(str);
    },
    // reconnectDelay: 5000,
    // heartbeatIncoming: 4000,
    // heartbeatOutgoing: 4000,
  });
  stompClient.onConnect = () => {
    console.log("socket connected");
    if (!stompClient || !roomChatId) {
      return;
    }
    stompClient.subscribe(
      `/room/:roomChatId/chat?roomChatId=${roomChatId}`,
      (message) => {
        console.log("message in sub: ", message);
        if (message.body) {
          callback(JSON.parse(message.body));
        }
      }
    );
  };

  stompClient.onStompError = function (frame) {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const sendMessage = (msgRequest: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(msgRequest),
      headers: { Authorization: stompClient.connectHeaders.Authorization },
    });
  }
};

// export const subscribeToRoomMessages = (
//   roomChatId: string,
//   callback: (message: any) => void
// ) => {
//   if (stompClient) {
//     const subscription = stompClient.subscribe(
//       `/room/:roomChatId/chat?roomChatId=${roomChatId}`,
//       (message) => {
//         console.log("message in sub: ", message);
//         if (message.body) {
//           callback(JSON.parse(message.body));
//         }
//       }
//     );
//     return subscription;
//   }
// };

// import { ChatMessageRequest } from "./DTOs/chat/Request/ChatMessageRequest";
//
// let socket: Socket | null = null;
// export const initSocket = (token: string) => {
//   const host = "localhost";
//   const port = 8585;
//   const url = `ws://${host}:${port}`;
//
//   socket = io(url, {
//     transports: ["websocket"],
//     path: `/ws-stomp?token=${token}`,
//   });
//   console.log("socket in initSocket: ", socket);
// };
// // export const initSocket = (token: string) => {
// //   const host = "localhost";
// //   const port = 8585;
// //   const url = `ws://${host}:${port}`;
// //
// //   socket = io(url, {
// //     host: "ws",
// //     path: "/ws-stomp",
// //     query: {
// //       token: token,
// //     },
// //   });
// //   console.log("socket in initSocket: ", socket);
// // }; // export const initSocket = (token: string) => {
// //   const host = "localhost";
// //   const port = 8585;
// //   let url = `ws://${host}:${port}/ws-stomp`;
// //   // url: 'ws://$host:$kPORT/ws-stomp?token=${context.read<AuthCubit>().state.auth!.accessToken}',
// //
// //   socket = io(url, {
// //     auth: {
// //       // headers: { Authorization: token },
// //       token: token,
// //     },
// //   });
// // };
// //
// export const connectSocket = () => {
//   if (socket) {
//     socket.connect();
//   }
// };
//
// export const disconnectSocket = () => {
//   if (socket && socket.connected) {
//     socket.disconnect();
//     socket = null;
//   }
// };
//
// export const subscribeToRoomMessages = (
//   roomChatId: string,
//   callback: (message: any) => void,
// ) => {
//   if (socket) {
//     const roomUrl = `/room/${roomChatId}/chat`;
//     socket.on(roomUrl, callback);
//   }
// };
//
// export const sendMessage = (data: ChatMessageRequest, token: string) => {
//   console.log("sendMessage: ", data);
//   console.log("socket in sendMessage: ", socket);
//   if (socket && socket.connected) {
//     console.log("data message: ", data);
//     socket.emit("/app/chat", {
//       destination: "/app/chat",
//       body: data,
//       headers: { Authorization: token },
//     });
//   }
// };
