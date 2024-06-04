import React from "react";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";

interface ChatMessagesProps {
  messages: MessageDTO[];
  sendingMessages: MessageDTO[];
  failedMessages: MessageDTO[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  sendingMessages,
  failedMessages,
}) => {
  const sortedMessages = [
    ...messages,
    ...sendingMessages,
    ...failedMessages,
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  console.log("sortedMessages", sortedMessages);

  console.log("sendingMessages", sendingMessages);

  console.log("failedMessages", failedMessages);

  console.log("messages", messages);

  return (
    <div>
      {sortedMessages.map((message) => (
        <div
          key={message.date}
          className={`mb-2 ${message.senderUsername === "currentUser" ? "text-right" : ""}`}
        >
          <div className="font-bold">{message.senderUsername}</div>
          <div>{message.content}</div>
          <div className="text-gray-500 text-sm">
            {message.date}
            {sendingMessages.some((m) => m.content === message.content) &&
              " (Sending...)"}
            {failedMessages.some((m) => m.content === message.content) &&
              " (Failed)"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
// import React from "react";

// interface ChatMessagesProps {
//   messages: any[];
// }

// const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
//   return (
//     <div>
//       {messages.map((message, index) => (
//         <div key={index} className="mb-2">
//           <div className="font-bold">{message.senderUsername}</div>
//           <div>{message.content}</div>
//           <div className="text-gray-500 text-sm">{message.date}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChatMessages;
