import React, { useState } from "react";
import { useSendMessageMutation } from "@/redux/features/common/chat/chatApiSlice";
import { sendMessage } from "@/utils/socketIO";
import { ChatMessageRequest } from "@/utils/DTOs/chat/Request/ChatMessageRequest";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface ChatInputProps {
  roomChatId: string;
  receiverUsername: string;
  onMessageSent: (message: any) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ roomChatId, receiverUsername, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [sendMessageMutation] = useSendMessageMutation();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const chatMessage: ChatMessageRequest = {
        content: message,
        receiverUsername,
        roomChatId,
      };
      if (!token) return;
      // sendMessageMutation(chatMessage)
      //   .then((response) => {
      //     if ("data" in response) {
      //       const sentMessage = response.data;
      //       onMessageSent(sentMessage);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error sending message:", error);
      //   });
      sendMessage(chatMessage, token);
      setMessage("");
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white rounded-r px-4 py-2"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
