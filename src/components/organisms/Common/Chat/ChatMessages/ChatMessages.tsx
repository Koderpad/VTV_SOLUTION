import React from "react";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

interface ChatMessagesProps {
  messages: MessageDTO[];
  failedMessages: MessageDTO[];
  currentUsername: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  failedMessages,
  currentUsername,
}) => {
  const sortedMessages = [...messages, ...failedMessages].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMessages.map((message, index) => {
        const isSentByCurrentUser = message.senderUsername === currentUsername;
        const isFailed = failedMessages.some(
          (m) => m.messengerId === message.messengerId
        );
        return (
          <div
            key={`${message.date}-${index}`}
            className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
              isSentByCurrentUser
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <div>{message.content}</div>
            <div className="text-xs opacity-50">
              {new Date(message.date).toLocaleTimeString()}
              {isFailed && " (Failed)"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
