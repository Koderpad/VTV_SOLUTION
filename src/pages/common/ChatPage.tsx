import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initSocket, disconnectSocket } from "@/utils/stock";
import ChatIcon from "@/components/organisms/Chat/ChatIcon";
import Chat from "@/components/organisms/Chat";

const ChatPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatIconClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <ChatIcon onClick={handleChatIconClick} />
      {isChatOpen && <Chat />}
    </>
  );
};

export default ChatPage;
