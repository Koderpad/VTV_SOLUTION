import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectRoomChats } from "@/redux/features/common/chat/chatSlice";
import ChatRoom from "./ChatRoom/ChatRoom";

const Chat: React.FC = () => {
  const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
    null
  );
  const [selectedReceiverUsername, setSelectedReceiverUsername] = useState<
    string | null
  >(null);
  const roomChats = useSelector(selectRoomChats);

  const handleRoomClick = (roomChatId: string, receiverUsername: string) => {
    setSelectedRoomChatId(roomChatId);
    setSelectedReceiverUsername(receiverUsername);
  };

  return (
    <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
      <div className="flex h-full">
        <div className="w-1/3 border-r border-gray-300">
          <ul className="overflow-y-auto h-full">
            {roomChats.slice(0, 5).map((room) => (
              <li
                key={room.roomChatId}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  handleRoomClick(room.roomChatId, room.receiverUsername)
                }
              >
                <div className="flex items-center">
                  <span className="font-bold">{room.receiverUsername}</span>
                  <span className="ml-2 text-gray-500">{room.lastMessage}</span>
                </div>
                <span className="text-sm text-gray-400">{room.lastDate}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 p-4">
          {selectedRoomChatId && selectedReceiverUsername && (
            <ChatRoom
              roomChatId={selectedRoomChatId}
              receiverUsername={selectedReceiverUsername}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
