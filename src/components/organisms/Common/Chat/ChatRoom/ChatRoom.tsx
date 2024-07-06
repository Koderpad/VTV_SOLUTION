import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectMessages,
  selectFailedMessages,
  addFailedMessage,
  removeFailedMessage,
} from "@/redux/features/common/chat/chatSlice";
import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";

import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";
import { sendMessage } from "@/utils/stock/configSocket";

interface ChatRoomProps {
  roomChatId: string;
  receiverUsername: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomChatId,
  receiverUsername,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const messages = useSelector((state: RootState) =>
    selectMessages(state, roomChatId)
  );
  const failedMessages = useSelector((state: RootState) =>
    selectFailedMessages(state, roomChatId)
  );
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMessagesByRoomQuery({
    roomChatId,
    page,
    size: 10,
  });

  const updateMessages = useCallback(() => {
    if (data?.messageDTOs) {
      failedMessages.forEach((failedMessage) => {
        const existingMessageIndex = data.messageDTOs.findIndex(
          (messageDTO) => messageDTO.messengerId === failedMessage.messengerId
        );
        if (existingMessageIndex === -1) {
          dispatch(addFailedMessage(failedMessage));
        }
      });
    }
  }, [data, dispatch, messages, failedMessages]);

  useEffect(() => {
    updateMessages();
  }, [updateMessages]);

  const handleSendMessage = async (content: string) => {
    if (!token || !username) return;

    const message: MessageDTO = {
      messengerId: Date.now().toString(),
      content,
      senderUsername: username,
      date: new Date().toISOString(),
      usernameSenderDelete: false,
      usernameReceiverDelete: false,
      roomChatId,
    };

    try {
      const message_ = {
        ...message,
        receiverUsername: receiverUsername,
      };
      await sendMessage(message_);
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(addFailedMessage(message));
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <ChatMessages
              messages={messages}
              failedMessages={failedMessages}
              currentUsername={username!}
            />
            {data && data.totalPage > page && (
              <button className="text-blue-500" onClick={handleLoadMore}>
                Load more
              </button>
            )}
          </>
        )}
      </div>
      <div className="mt-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
