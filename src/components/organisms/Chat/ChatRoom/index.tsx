import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectMessages,
  selectFailedMessages,
  addMessage,
  addFailedMessage,
  removeFailedMessage,
} from "@/redux/features/common/chat/chatSlice";
import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";
import { sendMessage } from "@/utils/stock";
import ChatMessages from "../ChatMessages";
import ChatInput from "../ChatInput";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

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
      data.messageDTOs.forEach((messageDTO) => {
        const existingMessageIndex = messages.findIndex(
          (message) => message.messengerId === messageDTO.messengerId
        );
        if (existingMessageIndex === -1) {
          dispatch(addMessage(messageDTO));
        }
      });

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
      messengerId: Date.now().toString(), // Simple unique ID generation
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
      // if (!messages.some((m) => m.messengerId === message.messengerId)) {
      //   dispatch(addMessage(message));
      // }
      // dispatch(addMessage(message));
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

// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   selectMessages,
//   selectFailedMessages,
//   addMessage,
//   addFailedMessage,
//   removeFailedMessage,
// } from "@/redux/features/common/chat/chatSlice";
// import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";
// import { sendMessage } from "@/utils/stock";
// import ChatMessages from "../ChatMessages";
// import ChatInput from "../ChatInput";
// import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

// interface ChatRoomProps {
//   roomChatId: string;
// }

// const ChatRoom: React.FC<ChatRoomProps> = ({ roomChatId }) => {
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const username = useSelector((state: RootState) => state.auth.user?.username);
//   const messages = useSelector((state: RootState) =>
//     selectMessages(state, roomChatId)
//   );
//   const failedMessages = useSelector((state: RootState) =>
//     selectFailedMessages(state, roomChatId)
//   );
//   const [page, setPage] = useState(1);
//   const { data, isLoading } = useGetMessagesByRoomQuery({
//     roomChatId,
//     page,
//     size: 10,
//   });

//   const updateMessages = useCallback(() => {
//     if (data?.messageDTOs) {
//       data.messageDTOs.forEach((messageDTO) => {
//         const existingMessageIndex = messages.findIndex(
//           (message) => message.messengerId === messageDTO.messengerId
//         );
//         if (existingMessageIndex === -1) {
//           dispatch(addMessage(messageDTO));
//         }
//       });

//       failedMessages.forEach((failedMessage) => {
//         const existingMessageIndex = data.messageDTOs.findIndex(
//           (messageDTO) => messageDTO.messengerId === failedMessage.messengerId
//         );
//         if (existingMessageIndex === -1) {
//           dispatch(addFailedMessage(failedMessage));
//         }
//       });
//     }
//   }, [data, dispatch, messages, failedMessages]);

//   useEffect(() => {
//     updateMessages();
//   }, [updateMessages]);

//   const handleSendMessage = async (content: string) => {
//     if (!token || !username) return;

//     const message: MessageDTO = {
//       messengerId: Date.now().toString(), // Simple unique ID generation
//       content,
//       senderUsername: username,
//       date: new Date().toISOString(),
//       usernameSenderDelete: false,
//       usernameReceiverDelete: false,
//       roomChatId,
//     };

//     dispatch(addMessage(message));

//     try {
//       await sendMessage(message);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       dispatch(removeFailedMessage(message));
//       dispatch(addFailedMessage(message));
//     }
//   };

//   const handleLoadMore = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <ChatMessages
//               messages={messages}
//               failedMessages={failedMessages}
//               currentUsername={username!}
//             />
//             {data && data.totalPage > page && (
//               <button className="text-blue-500" onClick={handleLoadMore}>
//                 Load more
//               </button>
//             )}
//           </>
//         )}
//       </div>
//       <div className="mt-4">
//         <ChatInput onSendMessage={handleSendMessage} />
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   selectMessages,
//   selectFailedMessages,
//   addMessage,
//   addFailedMessage,
//   removeFailedMessage,
// } from "@/redux/features/common/chat/chatSlice";
// import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";
// import { sendMessage } from "@/utils/stock";
// import ChatMessages from "../ChatMessages";
// import ChatInput from "../ChatInput";
// import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

// interface ChatRoomProps {
//   roomChatId: string;
// }

// const ChatRoom: React.FC<ChatRoomProps> = ({ roomChatId }) => {
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const username = useSelector((state: RootState) => state.auth.user?.username);
//   const messages = useSelector((state: RootState) =>
//     selectMessages(state, roomChatId)
//   );

//   const failedMessages = useSelector((state: RootState) =>
//     selectFailedMessages(state, roomChatId)
//   );
//   const [page, setPage] = useState(1);
//   const { data, isLoading } = useGetMessagesByRoomQuery({
//     roomChatId,
//     page,
//     size: 10,
//   });

//   useEffect(() => {
//     if (data && data.messageDTOs) {
//       console.log("data khi loading message", data);
//       // Thêm các tin nhắn mới vào Redux store
//       data.messageDTOs.forEach((messageDTO) => {
//         const existingMessageIndex = messages.findIndex(
//           (message) => message.messengerId === messageDTO.messengerId
//         );
//         if (existingMessageIndex === -1) {
//           dispatch(addMessage(messageDTO));
//         }
//       });

//       // Thêm các tin nhắn gửi thất bại vào Redux store
//       failedMessages.forEach((failedMessage) => {
//         const existingMessageIndex = data.messageDTOs.findIndex(
//           (messageDTO) => messageDTO.messengerId === failedMessage.messengerId
//         );
//         if (existingMessageIndex === -1) {
//           dispatch(addFailedMessage(failedMessage));
//         }
//       });
//     }
//   }, [data, dispatch, roomChatId, messages, failedMessages]);

//   const handleSendMessage = (content: string) => {
//     if (token) {
//       const message: MessageDTO = {
//         messengerId: "", // Hàm tạo messengerId duy nhất
//         content,
//         senderUsername: username || "", // Thay đổi senderUsername tương ứng
//         date: new Date().toISOString(), // Thời gian hiện tại
//         usernameSenderDelete: false,
//         usernameReceiverDelete: false,
//         roomChatId,
//       };
//       dispatch(addMessage(message));
//       sendMessage(message);
//     }
//   };

//   const handleLoadMore = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <ChatMessages
//               messages={messages}
//               failedMessages={failedMessages}
//               currentUsername={username!}
//             />
//             {data && data.totalPage > page && (
//               <button className="text-blue-500" onClick={handleLoadMore}>
//                 Load more
//               </button>
//             )}
//           </>
//         )}
//       </div>
//       <div className="mt-4">
//         <ChatInput onSendMessage={handleSendMessage} />
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;
