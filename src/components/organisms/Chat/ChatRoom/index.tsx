import React, { useEffect, useState } from "react";
import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";
import { subscribeToRoomMessages } from "@/utils/socketIO";
import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";

interface ChatRoomProps {
  roomChatId: string;
  receiverUsername: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomChatId, receiverUsername }) => {
  const { data, isLoading } = useGetMessagesByRoomQuery({
    roomChatId,
    page: 1,
    size: 10,
  });
  const [messages, setMessages] = useState<any[]>(data?.messageDTOs || []);

  useEffect(() => {
    setMessages(data?.messageDTOs || []);
  }, [data]);

  useEffect(() => {
    const onNewMessage = (newMessage: any) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    subscribeToRoomMessages(roomChatId, onNewMessage);

    return () => {
      // Hủy đăng ký lắng nghe sự kiện khi component unmount
      // (Bạn có thể tạo một hàm unsubscribeFromRoomMessages trong socketIO.ts để hủy đăng ký)
      // unsubscribeFromRoomMessages(roomChatId, onNewMessage);
    };
  }, [roomChatId]);

  const handleMessageSent = (sentMessage: any) => {
    setMessages((prevMessages) => [...prevMessages, sentMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ChatMessages key={1} messages={messages} />
        )}
      </div>
      <div className="mt-4">
        <ChatInput
          roomChatId={roomChatId}
          receiverUsername={receiverUsername}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
// import React from "react";
// import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";
// import ChatInput from "../ChatInput";
// import ChatMessages from "../ChatMessages";
//
//
// interface ChatRoomProps {
//   roomChatId: string;
//   receiverUsername: string;
// }
//
// const ChatRoom: React.FC<ChatRoomProps> = ({ roomChatId, receiverUsername }) => {
//   const { data, isLoading } = useGetMessagesByRoomQuery({
//     roomChatId,
//     page: 1,
//     size: 10,
//   });
//
//   const handleMessageSent = (sentMessage: any) => {
//     // Handle sent message logic here
//   };
//
//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <ChatMessages messages={data?.messageDTOs || []} />
//         )}
//       </div>
//       <div className="mt-4">
//         <ChatInput
//           roomChatId={roomChatId}
//           receiverUsername={receiverUsername}
//           onMessageSent={handleMessageSent}
//         />
//       </div>
//     </div>
//   );
// };
//
// export default ChatRoom;
