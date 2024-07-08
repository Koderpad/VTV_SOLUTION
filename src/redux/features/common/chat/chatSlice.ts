import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { RoomChatDTO } from "@/utils/DTOs/chat/Response/RoomChatResponse";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

interface ChatState {
  roomChats: RoomChatDTO[];
  messages: { [roomChatId: string]: { [messengerId: string]: MessageDTO } };
  failedMessages: { [roomChatId: string]: MessageDTO[] };
  requestedChatUsername: string | null;
  hasNewMessage: boolean;
}

const initialState: ChatState = {
  roomChats: [],
  messages: {},
  failedMessages: {},
  requestedChatUsername: null,
  hasNewMessage: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRoomChats: (state, action: PayloadAction<RoomChatDTO[]>) => {
      state.roomChats = action.payload;
    },
    addRoomChat: (state, action: PayloadAction<RoomChatDTO>) => {
      state.roomChats.unshift(action.payload);
    },
    setMessages: (
      state,
      action: PayloadAction<{ roomChatId: string; messages: MessageDTO[] }>
    ) => {
      const { roomChatId, messages } = action.payload;
      state.messages[roomChatId] = messages.reduce(
        (acc, message) => {
          acc[message.messengerId] = message;
          return acc;
        },
        {} as { [messengerId: string]: MessageDTO }
      );
    },
    addMessages: (
      state,
      action: PayloadAction<{ roomChatId: string; messages: MessageDTO[] }>
    ) => {
      const { roomChatId, messages } = action.payload;
      if (!state.messages[roomChatId]) {
        state.messages[roomChatId] = {};
      }
      messages.forEach((message) => {
        state.messages[roomChatId][message.messengerId] = message;
      });
    },
    addMessage: (state, action: PayloadAction<MessageDTO>) => {
      const { roomChatId, messengerId } = action.payload;
      if (!state.messages[roomChatId]) {
        state.messages[roomChatId] = {};
      }
      state.messages[roomChatId][messengerId] = action.payload;
    },
    updateRoomChat: (state, action: PayloadAction<MessageDTO>) => {
      const { roomChatId, date, content } = action.payload;
      const roomChat = state.roomChats.find(
        (room) => room.roomChatId === roomChatId
      );
      if (roomChat) {
        roomChat.lastMessage = content;
        roomChat.lastDate = date;
      }
    },
    addFailedMessage: (state, action: PayloadAction<MessageDTO>) => {
      const { roomChatId } = action.payload;
      if (!state.failedMessages[roomChatId]) {
        state.failedMessages[roomChatId] = [];
      }
      state.failedMessages[roomChatId].push(action.payload);
    },
    removeFailedMessage: (state, action: PayloadAction<MessageDTO>) => {
      const { roomChatId, messengerId } = action.payload;
      if (state.failedMessages[roomChatId]) {
        state.failedMessages[roomChatId] = state.failedMessages[
          roomChatId
        ].filter((message) => message.messengerId !== messengerId);
      }
    },
    requestOpenChat: (state, action: PayloadAction<string | null>) => {
      state.requestedChatUsername = action.payload;
    },
    setHasNewMessage: (state, action: PayloadAction<boolean>) => {
      state.hasNewMessage = action.payload;
    },
  },
});

export const {
  setRoomChats,
  addRoomChat,
  setMessages,
  addMessages,
  addMessage,
  updateRoomChat,
  addFailedMessage,
  removeFailedMessage,
  requestOpenChat,
  setHasNewMessage,
} = chatSlice.actions;

export const selectRoomChats = (state: RootState) => state.chat.roomChats;
export const selectMessages = (state: RootState, roomChatId: string) =>
  Object.values(state.chat.messages[roomChatId] || {}).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
export const selectFailedMessages = (state: RootState, roomChatId: string) =>
  state.chat.failedMessages[roomChatId] || [];
export const selectRequestedChatUsername = (state: RootState) =>
  state.chat.requestedChatUsername;
export const selectHasNewMessage = (state: RootState) =>
  state.chat.hasNewMessage;
export default chatSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "@/redux/store";
// import { RoomChatDTO } from "@/utils/DTOs/chat/Response/RoomChatResponse";
// import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

// interface ChatState {
//   roomChats: RoomChatDTO[];
//   messages: { [roomChatId: string]: MessageDTO[] };
//   failedMessages: { [roomChatId: string]: MessageDTO[] };
// }

// const initialState: ChatState = {
//   roomChats: [],
//   messages: {},
//   failedMessages: {},
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     setRoomChats: (state, action: PayloadAction<RoomChatDTO[]>) => {
//       state.roomChats = action.payload;
//     },
//     setMessages: (
//       state,
//       action: PayloadAction<{ roomChatId: string; messages: MessageDTO[] }>
//     ) => {
//       const { roomChatId, messages } = action.payload;
//       state.messages[roomChatId] = messages;
//     },
//     addMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId } = action.payload;
//       if (!state.messages[roomChatId]) {
//         state.messages[roomChatId] = [];
//       }
//       state.messages[roomChatId].push(action.payload);
//     },
//     addMessages: (
//       state,
//       action: PayloadAction<{ roomChatId: string; messages: MessageDTO[] }>
//     ) => {
//       const { roomChatId, messages } = action.payload;
//       if (!state.messages[roomChatId]) {
//         state.messages[roomChatId] = [];
//       }
//       state.messages[roomChatId] = [...messages, ...state.messages[roomChatId]];
//     },
//     updateRoomChat: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId, date, content } = action.payload;
//       const roomChat = state.roomChats.find(
//         (room) => room.roomChatId === roomChatId
//       );
//       if (roomChat) {
//         roomChat.lastMessage = content;
//         roomChat.lastDate = date;
//       }
//     },
//     addFailedMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId } = action.payload;
//       if (!state.failedMessages[roomChatId]) {
//         state.failedMessages[roomChatId] = [];
//       }
//       state.failedMessages[roomChatId].push(action.payload);
//     },
//     removeFailedMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId, messengerId } = action.payload;
//       if (state.failedMessages[roomChatId]) {
//         state.failedMessages[roomChatId] = state.failedMessages[
//           roomChatId
//         ].filter((message) => message.messengerId !== messengerId);
//       }
//     },
//   },
// });

// export const {
//   setRoomChats,
//   setMessages,
//   addMessage,
//   addMessages,
//   updateRoomChat,
//   addFailedMessage,
//   removeFailedMessage,
// } = chatSlice.actions;

// export const selectRoomChats = (state: RootState) => state.chat.roomChats;
// export const selectMessages = (state: RootState, roomChatId: string) =>
//   state.chat.messages[roomChatId] || [];
// export const selectFailedMessages = (state: RootState, roomChatId: string) =>
//   state.chat.failedMessages[roomChatId] || [];

// export default chatSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "@/redux/store";
// import { RoomChatDTO } from "@/utils/DTOs/chat/Response/RoomChatResponse";
// import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

// interface ChatState {
//   roomChats: RoomChatDTO[];
//   messages: { [roomChatId: string]: MessageDTO[] };
//   failedMessages: { [roomChatId: string]: MessageDTO[] };
// }

// const initialState: ChatState = {
//   roomChats: [],
//   messages: {},
//   failedMessages: {},
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     setRoomChats: (state, action: PayloadAction<RoomChatDTO[]>) => {
//       state.roomChats = action.payload;
//     },
//     addMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId } = action.payload;
//       if (!state.messages[roomChatId]) {
//         state.messages[roomChatId] = [];
//       }
//       state.messages[roomChatId].push(action.payload);
//     },
//     updateRoomChat: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId, date, content } = action.payload;
//       const roomChat = state.roomChats.find(
//         (room) => room.roomChatId === roomChatId
//       );
//       if (roomChat) {
//         roomChat.lastMessage = content;
//         roomChat.lastDate = date;
//       }
//     },
//     addFailedMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId } = action.payload;
//       if (!state.failedMessages[roomChatId]) {
//         state.failedMessages[roomChatId] = [];
//       }
//       state.failedMessages[roomChatId].push(action.payload);
//     },
//     removeFailedMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId, messengerId } = action.payload;
//       if (state.failedMessages[roomChatId]) {
//         state.failedMessages[roomChatId] = state.failedMessages[
//           roomChatId
//         ].filter((message) => message.messengerId !== messengerId);
//       }
//     },
//   },
// });

// export const {
//   setRoomChats,
//   addMessage,
//   updateRoomChat,
//   addFailedMessage,
//   removeFailedMessage,
// } = chatSlice.actions;

// export const selectRoomChats = (state: RootState) => state.chat.roomChats;
// export const selectMessages = (state: RootState, roomChatId: string) =>
//   state.chat.messages[roomChatId] || [];
// export const selectFailedMessages = (state: RootState, roomChatId: string) =>
//   state.chat.failedMessages[roomChatId] || [];

// export default chatSlice.reducer;
