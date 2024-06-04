import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectMessages,
  selectSendingMessages,
  selectFailedMessages,
  addMessage,
  removeSendingMessage,
  addFailedMessage,
  removeFailedMessage,
  addSendingMessage,
} from "@/redux/features/common/chat/chatSlice";
import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";
import { sendMessage } from "@/utils/stock";
import ChatMessages from "../ChatMessages";
import ChatInput from "../ChatInput";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

interface ChatRoomProps {
  roomChatId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomChatId }) => {
  // const dispatch = useDispatch();
  // const token = useSelector((state: RootState) => state.auth.token);
  // const messages = useSelector((state: RootState) =>
  //   selectMessages(state, roomChatId)
  // );
  // const sendingMessages = useSelector((state: RootState) =>
  //   selectSendingMessages(state, roomChatId)
  // );
  // const failedMessages = useSelector((state: RootState) =>
  //   selectFailedMessages(state, roomChatId)
  // );
  // const [page, setPage] = useState(1);
  // const { data, isLoading } = useGetMessagesByRoomQuery({
  //   roomChatId,
  //   page,
  //   size: 10,
  // });

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const messages = useSelector((state: RootState) =>
    selectMessages(state, roomChatId)
  );
  const sendingMessages = useSelector((state: RootState) =>
    selectSendingMessages(state, roomChatId)
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

  useEffect(() => {
    if (data && data.messageDTOs) {
      console.log("data khi loading message", data);
      // Thêm các tin nhắn mới vào Redux store
      data.messageDTOs.forEach((messageDTO) => {
        const existingMessageIndex = messages.findIndex(
          (message) => message.messengerId === messageDTO.messengerId
        );
        if (existingMessageIndex === -1) {
          dispatch(addMessage(messageDTO));
        }
      });

      // Xóa các tin nhắn đang gửi nếu chúng đã được gửi thành công
      sendingMessages.forEach((sendingMessage) => {
        const existingMessageIndex = data.messageDTOs.findIndex(
          (messageDTO) => messageDTO.messengerId === sendingMessage.messengerId
        );
        if (existingMessageIndex !== -1) {
          dispatch(removeSendingMessage(sendingMessage));
        }
      });

      // Thêm các tin nhắn gửi thất bại vào Redux store
      failedMessages.forEach((failedMessage) => {
        const existingMessageIndex = data.messageDTOs.findIndex(
          (messageDTO) => messageDTO.messengerId === failedMessage.messengerId
        );
        if (existingMessageIndex === -1) {
          dispatch(addFailedMessage(failedMessage));
        }
      });
    }
  }, [data, dispatch, roomChatId, messages, sendingMessages, failedMessages]);

  // useEffect(() => {
  //   if (data && data.messageDTOs) {
  //     console.log("data khi loading message", data);
  //     // Thêm các tin nhắn mới vào Redux store
  //     data.messageDTOs.forEach((messageDTO) => {
  //       const isSending = sendingMessages.some(
  //         (message) => message.content === messageDTO.content
  //       );
  //       const isFailed = failedMessages.some(
  //         (message) => message.content === messageDTO.content
  //       );

  //       if (!isSending && !isFailed) {
  //         dispatch(addMessage(messageDTO));
  //       }
  //     });

  //     // Xóa các tin nhắn đang gửi nếu chúng đã được gửi thành công
  //     sendingMessages.forEach((sendingMessage) => {
  //       const isSuccess = data.messageDTOs.some(
  //         (messageDTO) => messageDTO.content === sendingMessage.content
  //       );

  //       if (isSuccess) {
  //         dispatch(removeSendingMessage(sendingMessage));
  //       }
  //     });

  //     // Thêm các tin nhắn gửi thất bại vào Redux store
  //     failedMessages.forEach((failedMessage) => {
  //       const isSuccess = data.messageDTOs.some(
  //         (messageDTO) => messageDTO.content === failedMessage.content
  //       );

  //       if (!isSuccess) {
  //         dispatch(addFailedMessage(failedMessage));
  //       }
  //     });
  //   }
  // }, [data, dispatch, roomChatId, sendingMessages, failedMessages]);

  const handleSendMessage = (content: string) => {
    if (token) {
      const message: MessageDTO = {
        messengerId: "", // Hàm tạo messengerId duy nhất
        content,
        senderUsername: username || "", // Thay đổi senderUsername tương ứng
        date: new Date().toISOString(), // Thời gian hiện tại
        usernameSenderDelete: false,
        usernameReceiverDelete: false,
        roomChatId,
      };
      dispatch(addSendingMessage(message));
      sendMessage(message);
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
              sendingMessages={sendingMessages}
              failedMessages={failedMessages}
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
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { sendMessage } from "@/utils/stock";
// import ChatInput from "../ChatInput";
// import ChatMessages from "../ChatMessages";

// interface ChatRoomProps {
//   roomChatId: string;
//   messages_: any[];
//   receiverUsername: string;
// }

// const ChatRoom: React.FC<ChatRoomProps> = ({
//   roomChatId,
//   messages_,
//   receiverUsername,
// }) => {
//   const token = useSelector((state: RootState) => state.auth.token);

//   const handleSendMessage = (content: string) => {
//     if (token) {
//       const message = {
//         content,
//         receiverUsername,
//         roomChatId,
//       };

//       sendMessage(message);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         <ChatMessages messages={messages_} />
//       </div>
//       <div className="mt-4">
//         <ChatInput onSendMessage={handleSendMessage} />
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;
