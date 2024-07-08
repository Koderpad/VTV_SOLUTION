import React from "react";
import { MessageCircle } from "lucide-react";

interface ChatIconProps {
  onClick: () => void;
  hasNewMessage: boolean;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick, hasNewMessage }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-lg z-10 ${
        hasNewMessage ? "animate-pulse" : ""
      }`}
      onClick={onClick}
    >
      <MessageCircle size={24} />
      {hasNewMessage && (
        <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4"></span>
      )}
    </div>
  );
};

export default ChatIcon;

// import React from "react";
// import { MessageCircle } from "lucide-react";

// interface ChatIconProps {
//   onClick: () => void;
// }

// const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
//   return (
//     <div
//       className={`fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:scale-110 hover:shadow-lg z-10`}
//       onClick={onClick}
//     >
//       <MessageCircle size={24} />
//     </div>
//   );
// };

// export default ChatIcon;
