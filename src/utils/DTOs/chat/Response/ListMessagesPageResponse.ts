export interface MessageDTO {
  messengerId: string;
  content: string;
  senderUsername: string;
  date: string;
  usernameSenderDelete: boolean;
  usernameReceiverDelete: boolean;
  roomChatId: string;
}

export interface ListMessagesPageResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  page: number;
  size: number;
  totalPage: number;
  messageDTOs: MessageDTO[];
}
