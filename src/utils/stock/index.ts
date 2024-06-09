import { Client } from "@stomp/stompjs";
import { store } from "@/redux/store";
import {
  addMessage,
  updateRoomChat,
} from "@/redux/features/common/chat/chatSlice";
import { ChatMessageRequest } from "../DTOs/chat/Request/ChatMessageRequest";

let isConnected = false;

export const isSocketConnected = (): boolean => {
  return isConnected;
};

let stompClient: Client | null = null;

export const initSocket = (token: string) => {
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
  });

  stompClient.onConnect = (frame) => {
    console.log("socket connected");
    isConnected = true;
    if (frame) {
      console.log("frame: ", frame);
    }
  };

  stompClient.onStompError = (frame) => {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
  }
};

export const subscribeToRoomMessages = (roomChatId: string) => {
  if (!stompClient) return;

  const subscription = stompClient.subscribe(
    `/room/${roomChatId}/chat`,
    (message) => {
      if (message.body) {
        const newMessage = JSON.parse(message.body);
        store.dispatch(addMessage(newMessage));
        store.dispatch(updateRoomChat(newMessage));
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
};

export const sendMessage = (msgRequest: any) => {
  if (stompClient && stompClient.connected) {
    //transform msgRequest to ChatMessageRequest
    const chatMessageRequest: ChatMessageRequest = {
      content: msgRequest.content,
      receiverUsername: msgRequest.receiverUsername,
      roomChatId: msgRequest.roomChatId,
    };
    console.log("chatMessageRequest: ", chatMessageRequest);
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(chatMessageRequest),
      headers: { Authorization: stompClient.connectHeaders.Authorization },
    });
  }
};
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