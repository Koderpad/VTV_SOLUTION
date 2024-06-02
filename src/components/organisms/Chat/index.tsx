import React, { useState } from "react";
import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
import ChatRoomList from "./ChatRoomList";
import ChatRoom from "./ChatRoom";

const Chat: React.FC = () => {
  const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
    null,
  );
  const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });

  const handleRoomClick = (roomChatId: string) => {
    setSelectedRoomChatId(roomChatId);
  };

  const handleBackClick = () => {
    setSelectedRoomChatId(null);
    console.log("back");
  };

  return (
    <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
      <div className="flex h-full">
        <div className="w-1/3 border-r border-gray-300">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ChatRoomList
              rooms={data?.roomChatDTOs || []}
              onRoomClick={handleRoomClick}
            />
          )}
        </div>
        <div className="w-2/3 p-4">
          {selectedRoomChatId ? (
            <ChatRoom
              roomChatId={selectedRoomChatId}
              receiverUsername="username"
            />
          ) : (
            <div className="text-center text-gray-500">
              Select a room to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
