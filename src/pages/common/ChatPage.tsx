import React, { useState, useEffect } from "react";
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
  selectRequestedChatUsername,
  selectRoomChats,
  setRoomChats,
} from "@/redux/features/common/chat/chatSlice";
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
  const requestedChatUsername = useSelector(selectRequestedChatUsername);
  const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });
  const [createRoom] = useCreateRoomMutation();
  const roomChats = useSelector(selectRoomChats);

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

  useEffect(() => {
    const handleRequestedChat = async () => {
      if (requestedChatUsername && isSocketReady) {
        const existingRoom = roomChats.find(
          (room) => room.receiverUsername === requestedChatUsername
        );
        if (existingRoom) {
          // If the room already exists, just open the chat
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

    // return () => {
    //   dispatch(requestOpenChat("ok"));
    // };
  }, [requestedChatUsername, isSocketReady, createRoom, dispatch]);

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
