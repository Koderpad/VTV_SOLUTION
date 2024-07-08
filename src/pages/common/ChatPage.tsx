import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Chat from "@/components/organisms/Common/Chat/Chat";
import {
  useGetRoomChatListQuery,
  useCreateRoomMutation,
} from "@/redux/features/common/chat/chatApiSlice";
import {
  addRoomChat,
  requestOpenChat,
  selectHasNewMessage,
  selectRequestedChatUsername,
  selectRoomChats,
  setHasNewMessage,
  setRoomChats,
} from "@/redux/features/common/chat/chatSlice";
import {
  initSocket,
  disconnectSocket,
  isSocketConnected,
  subscribeToMultipleRooms,
  unsubscribeFromMultipleRooms,
} from "@/utils/stock/configSocket";
import ChatIcon from "@/components/organisms/Common/Chat/ChatIcon/ChatIcon";

const ChatPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const requestedChatUsername = useSelector(selectRequestedChatUsername);
  const { data, isLoading, refetch } = useGetRoomChatListQuery({
    page: 1,
    size: 10,
  });
  const [createRoom] = useCreateRoomMutation();
  const roomChats = useSelector(selectRoomChats);
  const hasNewMessage = useSelector(selectHasNewMessage);
  const reRender = useRef(true);

  const setupRoomChats = useCallback(async () => {
    if (data?.roomChatDTOs && isSocketReady) {
      console.log("Setting room chats...");
      dispatch(setRoomChats(data.roomChatDTOs));

      if (isSocketConnected()) {
        console.log("Start Subscribing to rooms...");
        const roomChatIds = data.roomChatDTOs.map((room) => room.roomChatId);
        try {
          // Unsubscribe from all rooms first
          await unsubscribeFromMultipleRooms(roomChatIds);
          console.log("Unsubscribed from all rooms");

          // Then subscribe to all rooms
          await subscribeToMultipleRooms(roomChatIds);
          console.log("Subscribed to all rooms");
        } catch (error) {
          console.error("Failed to unsubscribe/subscribe to rooms:", error);
        }
      }
    }
  }, [data, isSocketReady, dispatch]);

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
    setupRoomChats();
  }, [setupRoomChats]);

  useEffect(() => {
    if (hasNewMessage && reRender.current) {
      refetch().then(() => {
        reRender.current = false;
        setupRoomChats();
      });
    }
  }, [hasNewMessage, refetch, setupRoomChats]);

  useEffect(() => {
    const handleRequestedChat = async () => {
      if (requestedChatUsername && isSocketReady) {
        const existingRoom = roomChats.find(
          (room) => room.receiverUsername === requestedChatUsername
        );
        if (existingRoom) {
          setIsChatOpen(true);
        } else {
          try {
            const result = await createRoom(requestedChatUsername).unwrap();
            if (result.roomChatDTO.roomChatId) {
              dispatch(addRoomChat(result.roomChatDTO));
              await subscribeToMultipleRooms([result.roomChatDTO.roomChatId]);
              setIsChatOpen(true);
            }
          } catch (error) {
            console.error("Failed to create room:", error);
          }
        }
      }
    };

    handleRequestedChat();
  }, [requestedChatUsername, isSocketReady, createRoom, dispatch, roomChats]);

  const handleChatIconClick = () => {
    setIsChatOpen(!isChatOpen);
    if (hasNewMessage) {
      dispatch(setHasNewMessage(false));
    }
  };

  return (
    <>
      <ChatIcon
        onClick={handleChatIconClick}
        hasNewMessage={hasNewMessage && !isChatOpen}
      />
      {isChatOpen && <Chat />}
    </>
  );
};

export default ChatPage;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import Chat from "@/components/organisms/Common/Chat/Chat";
// import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
// import {
//   requestOpenChat,
//   selectRequestedChatUsername,
//   setRoomChats,
// } from "@/redux/features/common/chat/chatSlice";
// import {
//   initSocket,
//   disconnectSocket,
//   isSocketConnected,
//   subscribeToMultipleRooms,
// } from "@/utils/stock/configSocket";
// import ChatIcon from "@/components/organisms/Common/Chat/ChatIcon/ChatIcon";

// const ChatPage: React.FC = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isSocketReady, setIsSocketReady] = useState(false);
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const requestedChatUsername = useSelector(selectRequestedChatUsername);
//   const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });

//   useEffect(() => {
//     const setupSocket = async () => {
//       if (token) {
//         try {
//           await initSocket(token);
//           setIsSocketReady(true);
//           console.log("Socket connected successfully");
//         } catch (error) {
//           console.error("Socket connection failed:", error);
//         }
//       }
//     };

//     setupSocket();

//     return () => {
//       disconnectSocket();
//     };
//   }, [token]);

//   useEffect(() => {
//     const setupRoomChats = async () => {
//       if (data?.roomChatDTOs && isSocketReady) {
//         console.log("Setting room chats...");
//         dispatch(setRoomChats(data.roomChatDTOs));

//         if (isSocketConnected()) {
//           console.log("Start Subscribing to rooms...");
//           const roomChatIds = data.roomChatDTOs.map((room) => room.roomChatId);
//           try {
//             await subscribeToMultipleRooms(roomChatIds);
//             console.log("Subscribed to all rooms");
//           } catch (error) {
//             console.error("Failed to subscribe to rooms:", error);
//           }
//         }
//       }
//     };

//     setupRoomChats();
//   }, [data, isSocketReady, dispatch]);

//   useEffect(() => {
//     if (requestedChatUsername) {
//       setIsChatOpen(true);
//     }

//     return () => {
//       dispatch(requestOpenChat(null));
//     };
//   }, [requestedChatUsername]);

//   const handleChatIconClick = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   return (
//     <>
//       <ChatIcon onClick={handleChatIconClick} />
//       {isChatOpen && <Chat />}
//     </>
//   );
// };

// export default ChatPage;
