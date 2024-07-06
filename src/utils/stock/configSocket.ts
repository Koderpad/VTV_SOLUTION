import { Client, StompSubscription } from "@stomp/stompjs";
import { store } from "@/redux/store";
import {
  addMessage,
  updateRoomChat,
  addFailedMessage,
} from "@/redux/features/common/chat/chatSlice";
import { ChatMessageRequest } from "../DTOs/chat/Request/ChatMessageRequest";

let stompClient: Client | null = null;
let connectPromise: Promise<void> | null = null;
const subscriptions: { [key: string]: StompSubscription } = {};
let token: string | null = null;

const RECONNECT_DELAY = 5000;
const HEARTBEAT_INCOMING = 4000;
const HEARTBEAT_OUTGOING = 4000;

export const initSocket = (authToken: string): Promise<void> => {
  if (!authToken) return Promise.reject("No token provided");
  token = authToken;

  if (connectPromise) return connectPromise;

  const host = "localhost";
  const port = 8585;
  const url = `ws://${host}:${port}/ws-stomp?token=${token}`;

  stompClient = new Client({
    brokerURL: url,
    connectHeaders: {
      Authorization: token,
    },
    debug: (str) => {
      console.log(`STOMP: ${str}`);
    },
    reconnectDelay: RECONNECT_DELAY,
    heartbeatIncoming: HEARTBEAT_INCOMING,
    heartbeatOutgoing: HEARTBEAT_OUTGOING,
  });

  connectPromise = new Promise((resolve, reject) => {
    if (!stompClient) {
      reject(new Error("STOMP client not initialized"));
      return;
    }

    stompClient.onConnect = (frame) => {
      console.log("Socket connected successfully");
      if (frame) {
        console.log("Connected frame:", frame);
      }
      resolve();
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers["message"], frame.body);
      reject(new Error(`STOMP connection error: ${frame.headers["message"]}`));
    };

    stompClient.onWebSocketClose = (event) => {
      console.log("WebSocket connection closed", event);
      // Reconnection is handled automatically by stompjs
    };

    stompClient.activate();
  });

  return connectPromise;
};

export const disconnectSocket = () => {
  if (stompClient) {
    Object.values(subscriptions).forEach((subscription) =>
      subscription.unsubscribe()
    );
    stompClient.deactivate();
    stompClient = null;
  }
  connectPromise = null;
  token = null;
};

export const isSocketConnected = (): boolean => {
  return stompClient?.connected ?? false;
};

export const subscribeToRoomMessages = async (
  roomChatId: string
): Promise<() => void> => {
  if (!stompClient) {
    throw new Error("STOMP client not initialized");
  }

  await connectPromise;

  if (subscriptions[roomChatId]) {
    console.log("Already subscribed to room:", roomChatId);
    return () => {};
  }

  return new Promise((resolve, reject) => {
    try {
      subscriptions[roomChatId] = stompClient!.subscribe(
        `/room/${roomChatId}/chat`,
        (message) => {
          console.log("Received message in room:", roomChatId, message);
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            store.dispatch(addMessage(newMessage));
            store.dispatch(updateRoomChat(newMessage));
          }
        },
        {
          id: `sub-${roomChatId}`,
          ack: "client",
        }
      );
      resolve(() => {
        if (subscriptions[roomChatId]) {
          subscriptions[roomChatId].unsubscribe();
          delete subscriptions[roomChatId];
        }
      });
    } catch (error) {
      console.error("Error subscribing to room:", error);
      reject(error);
    }
  });
};

export const subscribeToMultipleRooms = async (
  roomChatIds: string[]
): Promise<() => void> => {
  if (!stompClient) {
    throw new Error("STOMP client not initialized");
  }

  await connectPromise;

  const unsubscribeFunctions: (() => void)[] = [];

  for (const roomChatId of roomChatIds) {
    if (subscriptions[roomChatId]) {
      console.log("Already subscribed to room:", roomChatId);
      continue;
    }

    try {
      subscriptions[roomChatId] = stompClient!.subscribe(
        `/room/${roomChatId}/chat`,
        (message) => {
          console.log("Received message in room:", roomChatId, message);
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            store.dispatch(addMessage(newMessage));
            store.dispatch(updateRoomChat(newMessage));
          }
        },
        {
          id: `sub-${roomChatId}`,
          ack: "client",
        }
      );

      unsubscribeFunctions.push(() => {
        if (subscriptions[roomChatId]) {
          subscriptions[roomChatId].unsubscribe();
          delete subscriptions[roomChatId];
        }
      });
    } catch (error) {
      console.error("Error subscribing to room:", roomChatId, error);
    }
  }

  return () => {
    unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
  };
};

export const sendMessage = async (msgRequest: any) => {
  if (!stompClient) {
    throw new Error("STOMP client not initialized");
  }

  // Ensure the connection is established before sending
  await connectPromise;

  const chatMessageRequest: ChatMessageRequest = {
    content: msgRequest.content,
    receiverUsername: msgRequest.receiverUsername,
    roomChatId: msgRequest.roomChatId,
  };

  console.log("chatMessageRequest: ", chatMessageRequest);

  try {
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(chatMessageRequest),
      headers: { Authorization: stompClient.connectHeaders.Authorization },
    });
    // Message sent successfully
    store.dispatch(addMessage(msgRequest));
  } catch (error) {
    console.error("Error sending message:", error);
    store.dispatch(addFailedMessage(msgRequest));
  }
};

// import { Client, StompSubscription } from "@stomp/stompjs";
// import { store } from "@/redux/store";
// import {
//   addMessage,
//   updateRoomChat,
//   addFailedMessage,
// } from "@/redux/features/common/chat/chatSlice";
// import { ChatMessageRequest } from "../DTOs/chat/Request/ChatMessageRequest";

// let stompClient: Client | null = null;
// let connectPromise: Promise<void> | null = null;
// const subscriptions: { [key: string]: StompSubscription } = {};
// let token: string | null = null;

// const RECONNECT_DELAY = 5000;
// const HEARTBEAT_INCOMING = 4000;
// const HEARTBEAT_OUTGOING = 4000;

// export const initSocket = (authToken: string): Promise<void> => {
//   if (!authToken) return Promise.reject("No token provided");
//   token = authToken;

//   if (connectPromise) return connectPromise;

//   const host = "localhost";
//   const port = 8585;
//   const url = `ws://${host}:${port}/ws-stomp?token=${token}`;

//   stompClient = new Client({
//     brokerURL: url,
//     connectHeaders: {
//       Authorization: token,
//     },
//     debug: (str) => {
//       console.log(`STOMP: ${str}`);
//     },
//     reconnectDelay: RECONNECT_DELAY,
//     heartbeatIncoming: HEARTBEAT_INCOMING,
//     heartbeatOutgoing: HEARTBEAT_OUTGOING,
//   });

//   connectPromise = new Promise((resolve, reject) => {
//     if (!stompClient) {
//       reject(new Error("STOMP client not initialized"));
//       return;
//     }

//     stompClient.onConnect = (frame) => {
//       console.log("Socket connected successfully");
//       if (frame) {
//         console.log("Connected frame:", frame);
//       }
//       resolve();
//     };

//     stompClient.onStompError = (frame) => {
//       console.error("STOMP error:", frame.headers["message"], frame.body);
//       reject(new Error(`STOMP connection error: ${frame.headers["message"]}`));
//     };

//     stompClient.onWebSocketClose = (event) => {
//       console.log("WebSocket connection closed", event);
//       // Reconnection is handled automatically by stompjs
//     };

//     stompClient.activate();
//   });

//   return connectPromise;
// };

// export const disconnectSocket = () => {
//   if (stompClient) {
//     Object.values(subscriptions).forEach((subscription) =>
//       subscription.unsubscribe()
//     );
//     stompClient.deactivate();
//     stompClient = null;
//   }
//   connectPromise = null;
//   token = null;
// };

// export const subscribeToRoomMessages = async (
//   roomChatId: string
// ): Promise<() => void> => {
//   if (!stompClient) {
//     throw new Error("STOMP client not initialized");
//   }

//   await connectPromise;

//   if (subscriptions[roomChatId]) {
//     console.log("Already subscribed to room:", roomChatId);
//     return () => {};
//   }

//   return new Promise((resolve, reject) => {
//     try {
//       subscriptions[roomChatId] = stompClient!.subscribe(
//         `/room/${roomChatId}/chat`,
//         (message) => {
//           console.log("Received message in room:", roomChatId, message);
//           if (message.body) {
//             const newMessage = JSON.parse(message.body);
//             store.dispatch(addMessage(newMessage));
//             store.dispatch(updateRoomChat(newMessage));
//           }
//         },
//         {
//           id: `sub-${roomChatId}`,
//           ack: "client",
//         }
//       );
//       resolve(() => {
//         if (subscriptions[roomChatId]) {
//           subscriptions[roomChatId].unsubscribe();
//           delete subscriptions[roomChatId];
//         }
//       });
//     } catch (error) {
//       console.error("Error subscribing to room:", error);
//       reject(error);
//     }
//   });
// };

// export const subscribeToMultipleRooms = async (
//   roomChatIds: string[]
// ): Promise<() => void> => {
//   if (!stompClient) {
//     throw new Error("STOMP client not initialized");
//   }

//   await connectPromise;

//   const unsubscribeFunctions: (() => void)[] = [];

//   for (const roomChatId of roomChatIds) {
//     if (subscriptions[roomChatId]) {
//       console.log("Already subscribed to room:", roomChatId);
//       continue;
//     }

//     try {
//       subscriptions[roomChatId] = stompClient!.subscribe(
//         `/room/${roomChatId}/chat`,
//         (message) => {
//           console.log("Received message in room:", roomChatId, message);
//           if (message.body) {
//             const newMessage = JSON.parse(message.body);
//             store.dispatch(addMessage(newMessage));
//             store.dispatch(updateRoomChat(newMessage));
//           }
//         },
//         {
//           id: `sub-${roomChatId}`,
//           ack: "client",
//         }
//       );

//       unsubscribeFunctions.push(() => {
//         if (subscriptions[roomChatId]) {
//           subscriptions[roomChatId].unsubscribe();
//           delete subscriptions[roomChatId];
//         }
//       });
//     } catch (error) {
//       console.error("Error subscribing to room:", roomChatId, error);
//     }
//   }

//   return () => {
//     unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
//   };
// };

// export const sendMessage = async (msgRequest: any) => {
//   if (!stompClient) {
//     throw new Error("STOMP client not initialized");
//   }

//   // Ensure the connection is established before sending
//   await connectPromise;

//   const chatMessageRequest: ChatMessageRequest = {
//     content: msgRequest.content,
//     receiverUsername: msgRequest.receiverUsername,
//     roomChatId: msgRequest.roomChatId,
//   };

//   console.log("chatMessageRequest: ", chatMessageRequest);

//   try {
//     stompClient.publish({
//       destination: "/app/chat",
//       body: JSON.stringify(chatMessageRequest),
//       headers: { Authorization: stompClient.connectHeaders.Authorization },
//     });
//     // Message sent successfully
//     store.dispatch(addMessage(msgRequest));
//   } catch (error) {
//     console.error("Error sending message:", error);
//     store.dispatch(addFailedMessage(msgRequest));
//   }
// };

// export const isSocketConnected = (): boolean => {
//   return stompClient?.connected ?? false;
// };

// import { Client } from "@stomp/stompjs";
// import { store } from "@/redux/store";
// import {
//   addMessage,
//   updateRoomChat,
// } from "@/redux/features/common/chat/chatSlice";
// import { ChatMessageRequest } from "../DTOs/chat/Request/ChatMessageRequest";

// let isConnected = false;

// export const isSocketConnected = (): boolean => {
//   return isConnected;
// };

// let stompClient: Client | null = null;

// export const initSocket = (token: string) => {
//   if (!token) return;
//   const host = "localhost";
//   const port = 8585;
//   const url = `ws://${host}:${port}/ws-stomp?token=${token}`;
//   stompClient = new Client({
//     brokerURL: url,
//     connectHeaders: {
//       Authorization: token,
//     },
//     debug: function (str) {
//       console.log(str);
//     },
//   });

//   stompClient.onConnect = (frame) => {
//     console.log("socket connected");
//     isConnected = true;
//     if (frame) {
//       console.log("frame: ", frame);
//     }
//   };

//   stompClient.onStompError = (frame) => {
//     console.log("Broker reported error: " + frame.headers["message"]);
//     console.log("Additional details: " + frame.body);
//   };

//   stompClient.activate();
// };

// export const disconnectSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     stompClient = null;
//     isConnected = false;
//   }
// };

// export const subscribeToRoomMessages = (roomChatId: string) => {
//   if (!stompClient) return;

//   const subscription = stompClient.subscribe(
//     `/room/${roomChatId}/chat`,
//     (message) => {
//       if (message.body) {
//         const newMessage = JSON.parse(message.body);
//         store.dispatch(addMessage(newMessage));
//         store.dispatch(updateRoomChat(newMessage));
//       }
//     }
//   );

//   return () => {
//     subscription.unsubscribe();
//   };
// };

// export const sendMessage = (msgRequest: any) => {
//   if (stompClient && stompClient.connected) {
//     //transform msgRequest to ChatMessageRequest
//     const chatMessageRequest: ChatMessageRequest = {
//       content: msgRequest.content,
//       receiverUsername: msgRequest.receiverUsername,
//       roomChatId: msgRequest.roomChatId,
//     };
//     console.log("chatMessageRequest: ", chatMessageRequest);
//     stompClient.publish({
//       destination: "/app/chat",
//       body: JSON.stringify(chatMessageRequest),
//       headers: { Authorization: stompClient.connectHeaders.Authorization },
//     });
//   }
// };

// import { Client } from "@stomp/stompjs";
// import { store } from "@/redux/store";
// import {
//   addMessage,
//   updateRoomChat,
// } from "@/redux/features/common/chat/chatSlice";

// let stompClient: Client | null = null;

// export const initSocket = (token: string) => {
//   if (!token) return;
//   const host = "localhost";
//   const port = 8585;
//   const url = `ws://${host}:${port}/ws-stomp?token=${token}`;
//   stompClient = new Client({
//     brokerURL: url,
//     connectHeaders: {
//       Authorization: token,
//     },
//     debug: function (str) {
//       console.log(str);
//     },
//   });

//   stompClient.onConnect = (frame) => {
//     console.log("socket connected");
//     if (frame) {
//       console.log("frame: ", frame);
//     }
//   };

//   stompClient.onStompError = (frame) => {
//     console.log("Broker reported error: " + frame.headers["message"]);
//     console.log("Additional details: " + frame.body);
//   };

//   stompClient.activate();
// };

// export const disconnectSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     stompClient = null;
//   }
// };

// export const subscribeToRoomMessages = (roomChatId: string) => {
//   if (!stompClient) return;

//   const subscription = stompClient.subscribe(
//     `/room/${roomChatId}/chat`,
//     (message) => {
//       if (message.body) {
//         const newMessage = JSON.parse(message.body);
//         store.dispatch(addMessage(newMessage));
//         store.dispatch(updateRoomChat(newMessage));
//       }
//     }
//   );

//   return () => {
//     subscription.unsubscribe();
//   };
// };

// export const sendMessage = (msgRequest: any) => {
//   if (stompClient && stompClient.connected) {
//     stompClient.publish({
//       destination: "/app/chat",
//       body: JSON.stringify(msgRequest),
//       headers: { Authorization: stompClient.connectHeaders.Authorization },
//     });
//   }
// };

// import { Client, Stomp } from "@stomp/stompjs";
// let stompClient: Client | null = null;

// export const initSocket = (
//   token: string,
//   roomChatId: string,
//   callbackMessage: (mess: any) => void
// ) => {
//   if (!token) return;
//   const host = "localhost";
//   const port = 8585;
//   const url = `ws://${host}:${port}/ws-stomp?token=${token}`;
//   stompClient = new Client({
//     brokerURL: url,
//     connectHeaders: {
//       Authorization: token,
//     },
//     debug: function (str) {
//       console.log(str);
//     },
//     // reconnectDelay: 5000,
//     // heartbeatIncoming: 4000,
//     // heartbeatOutgoing: 4000,
//   });
//   stompClient.onConnect = (frame) => {
//     console.log("socket connected");
//     if (!stompClient || !roomChatId) {
//       return;
//     }
//     if (frame) {
//       console.log("frame: ", frame);
//     }
//     stompClient.subscribe(`/room/${roomChatId}/chat`, (message) => {
//       console.log("message in sub: ", message);
//       if (message.body) {
//         callbackMessage(JSON.parse(message.body));
//       }
//     });
//     // stompClient.unsubscribe(`/room/${roomChatId}/chat`);
//   };

//   stompClient.onStompError = (frame) => {
//     console.log("Broker reported error: " + frame.headers["message"]);
//     console.log("Additional details: " + frame.body);
//   };

//   stompClient.activate();
// };

// export const disconnectSocket = () => {
//   if (stompClient) {
//     stompClient.deactivate();
//     stompClient = null;
//   }
// };

// export const sendMessage = (msgRequest: any) => {
//   if (stompClient && stompClient.connected) {
//     stompClient.publish({
//       destination: "/app/chat",
//       body: JSON.stringify(msgRequest),
//       headers: { Authorization: stompClient.connectHeaders.Authorization },
//     });
//   }
// };
