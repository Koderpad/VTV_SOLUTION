import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Chat from "@/components/organisms/Common/Chat/Chat";
import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
import { setRoomChats } from "@/redux/features/common/chat/chatSlice";
import {
  initSocket,
  disconnectSocket,
  isSocketConnected,
  subscribeToMultipleRooms,
} from "@/utils/stock/configSocket";
import ChatIcon from "@/components/organisms/Common/Chat/ChatIcon/ChatIcon";

const ChatPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });

  useEffect(() => {
    const setupSocket = async () => {
      if (token) {
        try {
          await initSocket(token);
          setIsSocketReady(true);
          console.log("Socket connected successfully");
        } catch (error) {
          console.error("Socket connection failed:", error);
        }
      }
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, [token]);

  useEffect(() => {
    const setupRoomChats = async () => {
      if (data?.roomChatDTOs && isSocketReady) {
        console.log("Setting room chats...");
        dispatch(setRoomChats(data.roomChatDTOs));

        if (isSocketConnected()) {
          console.log("Start Subscribing to rooms...");
          const roomChatIds = data.roomChatDTOs.map((room) => room.roomChatId);
          try {
            await subscribeToMultipleRooms(roomChatIds);
            console.log("Subscribed to all rooms");
          } catch (error) {
            console.error("Failed to subscribe to rooms:", error);
          }
        }
      }
    };

    setupRoomChats();
  }, [data, isSocketReady, dispatch]);

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
