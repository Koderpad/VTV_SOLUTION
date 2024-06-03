import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initSocket, disconnectSocket, sendMessage } from "@/utils/stock";
import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";

interface ChatRoomProps {
  roomChatId: string;
  messages_: any[];
  receiverUsername: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomChatId,
  messages_,
  receiverUsername,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSendMessage = (content: string) => {
    if (token) {
      const message = {
        content,
        receiverUsername,
        roomChatId,
      };

      sendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <ChatMessages messages={messages_} />
      </div>
      <div className="mt-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
