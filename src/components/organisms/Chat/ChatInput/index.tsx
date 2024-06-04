import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white rounded-r px-4 py-2"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
// import React, { useState } from "react";

// interface ChatInputProps {
//   onSendMessage: (content: string) => void;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
//   const [message, setMessage] = useState("");

//   const handleSendMessage = () => {
//     if (message.trim() !== "") {
//       onSendMessage(message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="flex">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
//         placeholder="Type a message..."
//       />
//       <button
//         onClick={handleSendMessage}
//         className="bg-blue-500 text-white rounded-r px-4 py-2"
//       >
//         Send
//       </button>
//     </div>
//   );
// };

// export default ChatInput;
