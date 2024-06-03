import React from "react";

interface ChatMessagesProps {
  messages: any[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className="mb-2">
          <div className="font-bold">{message.senderUsername}</div>
          <div>{message.content}</div>
          <div className="text-gray-500 text-sm">{message.date}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
