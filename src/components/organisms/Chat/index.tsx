import React, { useEffect, useState } from "react";
import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
import ChatRoomList from "./ChatRoomList";
import ChatRoom from "./ChatRoom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { disconnectSocket, initSocket } from "@/utils/stock";

const Chat: React.FC = () => {
  const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
    null
  );
  const [username, setUsername] = useState<string | null>(null);
  const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });
  console.log(data);
  const token = useSelector((state: RootState) => state.auth.token);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const handle = async () => {
      if (selectedRoomChatId) {
        console.log("selectedRoomChatId", selectedRoomChatId);
        if (token) {
          await initSocket(token, selectedRoomChatId, (newMessage: any) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          });

          console.log("socket connected");
        }
        setUsername(
          data?.roomChatDTOs.find(
            (room) => room.roomChatId === selectedRoomChatId
          )?.receiverUsername || ""
        );
      }
    };
    handle();

    return () => {
      disconnectSocket();
    };
  }, [selectedRoomChatId]);

  const handleRoomClick = (roomChatId: string) => {
    setSelectedRoomChatId(roomChatId);
  };

  const handleBackClick = () => {
    setSelectedRoomChatId(null);
    console.log("back");
  };

  useEffect(() => {
    console.log("username", username);
  }, [username]);

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
            username ? (
              <ChatRoom
                roomChatId={selectedRoomChatId}
                messages_={messages}
                receiverUsername={username}
              />
            ) : (
              <div className="text-center text-gray-500">
                Select a room to start chatting
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;
