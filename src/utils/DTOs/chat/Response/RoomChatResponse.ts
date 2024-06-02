export interface RoomChatDTO {
  romChatId: string;
  senderUsername: string;
  receiverUsername: string;
  lastMessage: string;
  lastDate: string;
  senderDelete: boolean;
  receiverDelete: boolean;
  senderSeen: boolean;
  receiverSeen: boolean;
}

export interface RoomChatResponse {
  status: string;
  message: string;
  code: number;
  roomChatDTO: RoomChatDTO;
}
