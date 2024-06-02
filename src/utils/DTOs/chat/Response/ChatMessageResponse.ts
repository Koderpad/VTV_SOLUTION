export interface ChatMessageResponse {
  status: string;
  message: string;
  code: number;
  content: string;
  date: string;
  senderUsername: string;
  receiverUsername: string;
  roomChatId: string;
}
