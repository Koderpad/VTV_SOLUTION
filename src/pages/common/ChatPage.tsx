import React, { useState } from "react";
import ChatIcon from "@/components/organisms/Common/Chat/ChatIcon";
import Chat from "@/components/organisms/Common/Chat";

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
