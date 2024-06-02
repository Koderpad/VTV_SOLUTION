import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";
import React from "react";

interface ChatMessagesProps {
  messages: MessageDTO[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.date} className="mb-2">
            <div className="flex items-center">
              <span className="font-bold">{message.senderUsername}</span>
              <span className="ml-2">{message.content}</span>
            </div>
            <span className="text-sm text-gray-400">{message.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatMessages;
