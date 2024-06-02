import { RoomChatDTO } from "./RoomChatResponse";

export interface ListRoomChatsPageResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  page: number;
  size: number;
  totalPage: number;
  roomChatDTOs: RoomChatDTO[];
}
