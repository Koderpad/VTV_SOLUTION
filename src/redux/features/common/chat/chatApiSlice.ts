import { apiSlice } from "@/redux/api";
import { RoomChatResponse } from "@/utils/DTOs/chat/Response/RoomChatResponse";
import { ChatMessageRequest } from "@/utils/DTOs/chat/Request/ChatMessageRequest";
import { ChatMessageResponse } from "@/utils/DTOs/chat/Response/ChatMessageResponse";
import { ListRoomChatsPageResponse } from "@/utils/DTOs/chat/Response/ListRoomChatsPageResponse";
import { ListMessagesPageResponse } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation<RoomChatResponse, string>({
      query: (receiverUsername) => ({
        url: `/chat/room/create-room?receiverUsername=${receiverUsername}`,
        method: "POST",
      }),
    }),
    sendMessage: builder.mutation<ChatMessageResponse, ChatMessageRequest>({
      query: (data) => ({
        url: `/chat/send`,
        method: "POST",
        body: data,
      }),
    }),
    getRoomChatList: builder.query<ListRoomChatsPageResponse, { page: number; size: number }>({
      query: ({ page, size }) => `/chat/room/list/page/${page}/size/${size}`,
    }),
    deleteRoom: builder.mutation<RoomChatResponse, string>({
      query: (roomChatId) => ({
        url: `/chat/room/delete-room/${roomChatId}`,
        method: "DELETE",
      }),
    }),
    getMessagesByRoom: builder.query<
      ListMessagesPageResponse,
      { roomChatId: string; page: number; size: number }
    >({
      query: ({ roomChatId, page, size }) =>
        `/chat/message/list/room-chat/${roomChatId}/page/${page}/size/${size}`,
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useSendMessageMutation,
  useGetRoomChatListQuery,
  useDeleteRoomMutation,
  useGetMessagesByRoomQuery,
} = chatApi;
