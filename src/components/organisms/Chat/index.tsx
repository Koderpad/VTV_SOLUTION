import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  disconnectSocket,
  initSocket,
  isSocketConnected,
  subscribeToRoomMessages,
} from "@/utils/stock";
import {
  setRoomChats,
  selectRoomChats,
} from "@/redux/features/common/chat/chatSlice";
import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
import ChatRoom from "./ChatRoom";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
    null
  );
  const [selectedReceiverUsername, setSelectedReceiverUsername] = useState<
    string | null
  >(null);
  const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });
  const roomChats = useSelector(selectRoomChats);

  useEffect(() => {
    if (token) {
      initSocket(token)
        .then(() => console.log("Socket connected successfully"))
        .catch((error) => console.error("Socket connection failed:", error));
    }

    return () => {
      disconnectSocket();
    };
  }, [token]);

  useEffect(() => {
    if (data?.roomChatDTOs) {
      dispatch(setRoomChats(data.roomChatDTOs));
    }
  }, [data, dispatch]);

  const subscribeToRooms = useCallback(async () => {
    if (!isSocketConnected()) return;

    const unsubscribes = await Promise.all(
      roomChats.map(async (roomChat) => {
        try {
          console.log("Subscribing to room...", roomChat.roomChatId);
          return await subscribeToRoomMessages(roomChat.roomChatId);
        } catch (error) {
          console.error(
            `Failed to subscribe to room ${roomChat.roomChatId}:`,
            error
          );
          return null;
        }
      })
    );

    return () => {
      console.log("Unsubscribing from rooms...");
      unsubscribes.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, [roomChats]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setupSubscriptions = async () => {
      cleanup = await subscribeToRooms();
    };

    setupSubscriptions();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [subscribeToRooms]);

  const handleRoomClick = (roomChatId: string, receiverUsername: string) => {
    setSelectedRoomChatId(roomChatId);
    setSelectedReceiverUsername(receiverUsername);
  };

  return (
    <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
      <div className="flex h-full">
        <div className="w-1/3 border-r border-gray-300">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
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
                    <span className="ml-2 text-gray-500">
                      {room.lastMessage}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{room.lastDate}</span>
                </li>
              ))}
            </ul>
          )}
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

// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   initSocket,
//   isSocketConnected,
//   subscribeToRoomMessages,
// } from "@/utils/stock";
// import {
//   setRoomChats,
//   selectRoomChats,
// } from "@/redux/features/common/chat/chatSlice";
// import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
// import ChatRoom from "./ChatRoom";

// const Chat: React.FC = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
//     null
//   );
//   const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });
//   const roomChats = useSelector(selectRoomChats);

//   useEffect(() => {
//     if (token) {
//       initSocket(token)
//         .then(() => console.log("Socket connected successfully"))
//         .catch((error) => console.error("Socket connection failed:", error));
//     }
//   }, [token]);

//   useEffect(() => {
//     if (data?.roomChatDTOs) {
//       dispatch(setRoomChats(data.roomChatDTOs));
//     }
//   }, [data, dispatch]);

//   const subscribeToRooms = useCallback(async () => {
//     if (!isSocketConnected()) return;

//     const unsubscribes = await Promise.all(
//       roomChats.map(async (roomChat) => {
//         try {
//           return await subscribeToRoomMessages(roomChat.roomChatId);
//         } catch (error) {
//           console.error(
//             `Failed to subscribe to room ${roomChat.roomChatId}:`,
//             error
//           );
//           return null;
//         }
//       })
//     );

//     return () => {
//       unsubscribes.forEach((unsubscribe) => {
//         if (typeof unsubscribe === "function") {
//           unsubscribe();
//         }
//       });
//     };
//   }, [roomChats]);

//   useEffect(() => {
//     let cleanup: (() => void) | undefined;

//     const setupSubscriptions = async () => {
//       cleanup = await subscribeToRooms();
//     };

//     setupSubscriptions();

//     return () => {
//       if (cleanup) {
//         cleanup();
//       }
//     };
//   }, [subscribeToRooms]);

//   const handleRoomClick = (roomChatId: string) => {
//     setSelectedRoomChatId(roomChatId);
//   };

//   return (
//     <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
//       <div className="flex h-full">
//         <div className="w-1/3 border-r border-gray-300">
//           {isLoading ? (
//             <div>Loading...</div>
//           ) : (
//             <ul className="overflow-y-auto h-full">
//               {roomChats.slice(0, 5).map((room) => (
//                 <li
//                   key={room.roomChatId}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleRoomClick(room.roomChatId)}
//                 >
//                   <div className="flex items-center">
//                     <span className="font-bold">{room.receiverUsername}</span>
//                     <span className="ml-2 text-gray-500">
//                       {room.lastMessage}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-400">{room.lastDate}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="w-2/3 p-4">
//           {selectedRoomChatId && <ChatRoom roomChatId={selectedRoomChatId} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   initSocket,
//   isSocketConnected,
//   subscribeToRoomMessages,
// } from "@/utils/stock";
// import {
//   setRoomChats,
//   selectRoomChats,
// } from "@/redux/features/common/chat/chatSlice";
// import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
// import ChatRoom from "./ChatRoom";

// const Chat: React.FC = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
//     null
//   );
//   const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });
//   let roomChats = useSelector(selectRoomChats);

//   if (!roomChats || roomChats.length === 0) {
//     roomChats = data?.roomChatDTOs || [];
//   }

//   useEffect(() => {
//     if (token) {
//       initSocket(token)
//         .then(() => console.log("Socket connected successfully"))
//         .catch((error) => console.error("Socket connection failed:", error));
//     }
//   }, [token]);

//   useEffect(() => {
//     if (data && data.roomChatDTOs) {
//       dispatch(setRoomChats(data.roomChatDTOs));
//     }

//     const unsubscribes = roomChats
//       .filter(() => isSocketConnected())
//       .map((roomChat) => subscribeToRoomMessages(roomChat.roomChatId));

//     return () => {
//       unsubscribes.forEach((unsubscribe) => {
//         if (typeof unsubscribe === "function") {
//           unsubscribe();
//         }
//       });
//     };
//   }, [roomChats, data, dispatch]);

//   const handleRoomClick = (roomChatId: string) => {
//     setSelectedRoomChatId(roomChatId);
//   };

//   return (
//     <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
//       <div className="flex h-full">
//         <div className="w-1/3 border-r border-gray-300">
//           {isLoading ? (
//             <div>Loading...</div>
//           ) : (
//             <ul className="overflow-y-auto h-full">
//               {roomChats.slice(0, 5).map((room) => (
//                 <li
//                   key={room.roomChatId}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleRoomClick(room.roomChatId)}
//                 >
//                   <div className="flex items-center">
//                     <span className="font-bold">{room.receiverUsername}</span>
//                     <span className="ml-2 text-gray-500">
//                       {room.lastMessage}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-400">{room.lastDate}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="w-2/3 p-4">
//           {selectedRoomChatId && <ChatRoom roomChatId={selectedRoomChatId} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   initSocket,
//   isSocketConnected,
//   subscribeToRoomMessages,
// } from "@/utils/stock";
// import {
//   setRoomChats,
//   selectRoomChats,
// } from "@/redux/features/common/chat/chatSlice";
// import { useGetRoomChatListQuery } from "@/redux/features/common/chat/chatApiSlice";
// import ChatRoom from "./ChatRoom";

// const Chat: React.FC = () => {
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [selectedRoomChatId, setSelectedRoomChatId] = useState<string | null>(
//     null
//   );
//   const { data, isLoading } = useGetRoomChatListQuery({ page: 1, size: 10 });
//   let roomChats = useSelector(selectRoomChats);

//   if (!roomChats || roomChats.length === 0) {
//     roomChats = data?.roomChatDTOs || [];
//   }

//   useEffect(() => {
//     if (token) {
//       initSocket(token);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (data && data.roomChatDTOs) {
//       dispatch(setRoomChats(data.roomChatDTOs));
//     }

//     const unsubscribes = roomChats
//       .filter(() => isSocketConnected()) // Chỉ subscribe khi đã kết nối
//       .map((roomChat) => subscribeToRoomMessages(roomChat.roomChatId));

//     return () => {
//       unsubscribes.forEach((unsubscribe) => {
//         if (typeof unsubscribe === "function") {
//           unsubscribe();
//         }
//       });
//     };
//   }, [roomChats, data, dispatch]);

//   const handleRoomClick = (roomChatId: string) => {
//     setSelectedRoomChatId(roomChatId);
//   };

//   return (
//     <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded shadow-lg">
//       <div className="flex h-full">
//         <div className="w-1/3 border-r border-gray-300">
//           {isLoading ? (
//             <div>Loading...</div>
//           ) : (
//             <ul className="overflow-y-auto h-full">
//               {roomChats.slice(0, 5).map((room) => (
//                 <li
//                   key={room.roomChatId}
//                   className="p-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleRoomClick(room.roomChatId)}
//                 >
//                   <div className="flex items-center">
//                     <span className="font-bold">{room.receiverUsername}</span>
//                     <span className="ml-2 text-gray-500">
//                       {room.lastMessage}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-400">{room.lastDate}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="w-2/3 p-4">
//           {selectedRoomChatId && <ChatRoom roomChatId={selectedRoomChatId} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
