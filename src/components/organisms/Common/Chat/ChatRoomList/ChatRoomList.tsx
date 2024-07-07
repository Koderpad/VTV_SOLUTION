// import React from "react";
// import { RoomChatDTO } from "@/utils/DTOs/chat/Response/RoomChatResponse";

// interface ChatRoomListProps {
//   rooms: RoomChatDTO[];
//   onRoomClick: (roomChatId: string) => void;
// }

// const ChatRoomList: React.FC<ChatRoomListProps> = ({ rooms, onRoomClick }) => {
//   return (
//     <ul className="overflow-y-auto h-full">
//       {rooms.map((room) => (
//         <li
//           key={room.roomChatId}
//           className="p-2 cursor-pointer hover:bg-gray-100"
//           onClick={() => onRoomClick(room.roomChatId)}
//         >
//           <div className="flex items-center">
//             <span className="font-bold">{room.receiverUsername}</span>
//             <span className="ml-2 text-gray-500">{room.lastMessage}</span>
//           </div>
//           <span className="text-sm text-gray-400">{room.lastDate}</span>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default ChatRoomList;

// import React from "react";

// interface ChatRoomListProps {
//   rooms: any[];
//   onRoomClick: (roomChatId: string) => void;
// }

// const ChatRoomList: React.FC<ChatRoomListProps> = ({ rooms, onRoomClick }) => {
//   let cou = 0;
//   return (
//     <ul className="overflow-y-auto h-full">
//       {rooms.map((room) => (
//         <li
//           key={cou++}
//           className="p-2 cursor-pointer hover:bg-gray-100"
//           onClick={() => onRoomClick(room.roomChatId)}
//         >
//           <div className="flex items-center">
//             <span className="font-bold">{room.receiverUsername}</span>
//             <span className="ml-2 text-gray-500">{room.lastMessage}</span>
//           </div>
//           <span className="text-sm text-gray-400">{room.lastDate}</span>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default ChatRoomList;
