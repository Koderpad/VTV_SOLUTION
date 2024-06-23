import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { RoomChatDTO } from "@/utils/DTOs/chat/Response/RoomChatResponse";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

interface ChatState {
  roomChats: RoomChatDTO[];
  messages: { [roomChatId: string]: MessageDTO[] };
  failedMessages: { [roomChatId: string]: MessageDTO[] };
}

const initialState: ChatState = {
  roomChats: [],
  messages: {},
  failedMessages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRoomChats: (state, action: PayloadAction<RoomChatDTO[]>) => {
      state.roomChats = action.payload;
    },
    addMessage: (state, action: PayloadAction<MessageDTO>) => {
      const { roomChatId } = action.payload;
      if (!state.messages[roomChatId]) {
        state.messages[roomChatId] = [];
      }
      state.messages[roomChatId].push(action.payload);
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
  },
});

export const {
  setRoomChats,
  addMessage,
  updateRoomChat,
  addFailedMessage,
  removeFailedMessage,
} = chatSlice.actions;

export const selectRoomChats = (state: RootState) => state.chat.roomChats;
export const selectMessages = (state: RootState, roomChatId: string) =>
  state.chat.messages[roomChatId] || [];
export const selectFailedMessages = (state: RootState, roomChatId: string) =>
  state.chat.failedMessages[roomChatId] || [];

export default chatSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "@/redux/store";
// import { RoomChatDTO } from "@/utils/DTOs/chat/Response/RoomChatResponse";
// import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

// interface ChatState {
//   roomChats: RoomChatDTO[];
//   messages: { [roomChatId: string]: MessageDTO[] };
//   sendingMessages: { [roomChatId: string]: MessageDTO[] };
//   failedMessages: { [roomChatId: string]: MessageDTO[] };
// }

// const initialState: ChatState = {
//   roomChats: [],
//   messages: {},
//   sendingMessages: {},
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
//     addSendingMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId } = action.payload;
//       if (!state.sendingMessages[roomChatId]) {
//         state.sendingMessages[roomChatId] = [];
//       }
//       state.sendingMessages[roomChatId].push(action.payload);
//     },
//     removeSendingMessage: (state, action: PayloadAction<MessageDTO>) => {
//       const { roomChatId, messengerId } = action.payload;
//       if (state.sendingMessages[roomChatId]) {
//         state.sendingMessages[roomChatId] = state.sendingMessages[
//           roomChatId
//         ].filter((message) => message.messengerId !== messengerId);
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
//   addSendingMessage,
//   removeSendingMessage,
//   addFailedMessage,
//   removeFailedMessage,
// } = chatSlice.actions;

// export const selectRoomChats = (state: RootState) => state.chat.roomChats;
// export const selectMessages = (state: RootState, roomChatId: string) =>
//   state.chat.messages[roomChatId] || [];
// export const selectSendingMessages = (state: RootState, roomChatId: string) =>
//   state.chat.sendingMessages[roomChatId] || [];
// export const selectFailedMessages = (state: RootState, roomChatId: string) =>
//   state.chat.failedMessages[roomChatId] || [];

// export default chatSlice.reducer;
