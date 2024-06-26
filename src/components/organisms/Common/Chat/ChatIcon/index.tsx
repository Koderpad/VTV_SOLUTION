import React from "react";

interface ChatIconProps {
  onClick: () => void;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
  return (
    <div
      className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <i className="fas fa-comment text-2xl"></i>
    </div>
  );
};

export default ChatIcon;
