import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectMessages,
  selectFailedMessages,
  addFailedMessage,
  removeFailedMessage,
  setMessages,
  addMessages,
} from "@/redux/features/common/chat/chatSlice";
import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";

import ChatMessages from "../ChatMessages/ChatMessages";
import ChatInput from "../ChatInput/ChatInput";
import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";
import { sendMessage } from "@/utils/stock/configSocket";
import { getShopByUsername } from "@/services/common/ShopService";

interface ChatRoomProps {
  roomChatId: string;
  receiverUsername: string;
}

const useShopAvatar = (username: string) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopAvatar = async () => {
      try {
        const shopData = await getShopByUsername(username);
        setAvatar(shopData.shopDTO.avatar);
      } catch (error) {
        console.error("Error fetching shop avatar:", error);
        setAvatar(null);
      }
    };

    fetchShopAvatar();
    // if (username.endsWith(".shop")) {
    //   fetchShopAvatar();
    // } else {
    //   setAvatar(null); // Set default avatar for non-shop users
    // }
  }, [username]);

  return avatar;
};

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomChatId,
  receiverUsername,
}) => {
  // const avatar = useShopAvatar(receiverUsername);

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const messages = useSelector((state: RootState) =>
    selectMessages(state, roomChatId)
  );
  const failedMessages = useSelector((state: RootState) =>
    selectFailedMessages(state, roomChatId)
  );
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading, isFetching, refetch } = useGetMessagesByRoomQuery(
    {
      roomChatId,
      page,
      size: 8,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const prevMessagesLengthRef = useRef(messages.length);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    dispatch(setMessages({ roomChatId, messages: [] }));
    setPage(1);
    setHasMore(true);
    refetch();

    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, [dispatch, roomChatId, refetch]);

  useEffect(() => {
    if (data?.messageDTOs && !isLoading && !isFetching) {
      const scrollContainer = messagesContainerRef.current;
      const scrollPosition = scrollContainer
        ? scrollContainer.scrollHeight - scrollContainer.scrollTop
        : 0;

      if (page === 1) {
        dispatch(setMessages({ roomChatId, messages: data.messageDTOs }));
      } else {
        dispatch(addMessages({ roomChatId, messages: data.messageDTOs }));
      }

      setIsLoadingMore(false);
      setHasMore(data.messageDTOs.length === 8 && page < data.totalPage);

      setTimeout(() => {
        if (scrollContainer && page > 1) {
          scrollContainer.scrollTop =
            scrollContainer.scrollHeight - scrollPosition;
        }
      }, 0);
    }
  }, [data, isLoading, isFetching, dispatch, roomChatId, page]);

  useEffect(() => {
    if (
      shouldScrollToBottom ||
      messages.length > prevMessagesLengthRef.current
    ) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, shouldScrollToBottom, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 1;
      setShouldScrollToBottom(isAtBottom);

      if (
        scrollTop === 0 &&
        !isLoadingMore &&
        hasMore &&
        !isLoading &&
        !isFetching
      ) {
        setIsLoadingMore(true);

        if (loadMoreTimeoutRef.current) {
          clearTimeout(loadMoreTimeoutRef.current);
        }

        loadMoreTimeoutRef.current = setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
        }, 2000); // 2 seconds delay
      }
    }
  }, [isLoadingMore, hasMore, isLoading, isFetching]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleSendMessage = async (content: string) => {
    if (!token || !username) return;

    const message: MessageDTO = {
      messengerId: Date.now().toString(),
      content,
      senderUsername: username,
      date: new Date().toISOString(),
      usernameSenderDelete: false,
      usernameReceiverDelete: false,
      roomChatId,
    };

    try {
      const message_ = {
        ...message,
        receiverUsername: receiverUsername,
      };
      await sendMessage(message_);
      setShouldScrollToBottom(true);
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(addFailedMessage(message));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 flex items-center">
        {/* {avatar ? (
          <img
            src={avatar}
            alt={`${receiverUsername}'s avatar`}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div> // Placeholder for default avatar
        )} */}
        <h2 className="text-lg font-semibold">{receiverUsername}</h2>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto"
        onScroll={handleScroll}
      >
        <div ref={loadingRef}>
          {isLoadingMore && (
            <div className="text-center text-gray-500 py-2">
              Đang tải thêm tin nhắn...
            </div>
          )}
          {!hasMore && (
            <div className="text-center text-gray-500 py-2">
              Không có tin nhắn nào để hiển thị
            </div>
          )}
        </div>
        <ChatMessages
          messages={messages}
          failedMessages={failedMessages}
          currentUsername={username!}
        />
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;

// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   selectMessages,
//   selectFailedMessages,
//   addFailedMessage,
//   removeFailedMessage,
// } from "@/redux/features/common/chat/chatSlice";
// import { useGetMessagesByRoomQuery } from "@/redux/features/common/chat/chatApiSlice";

// import ChatMessages from "../ChatMessages/ChatMessages";
// import ChatInput from "../ChatInput/ChatInput";
// import { MessageDTO } from "@/utils/DTOs/chat/Response/ListMessagesPageResponse";
// import { sendMessage } from "@/utils/stock/configSocket";

// interface ChatRoomProps {
//   roomChatId: string;
//   receiverUsername: string;
// }

// const ChatRoom: React.FC<ChatRoomProps> = ({
//   roomChatId,
//   receiverUsername,
// }) => {
//   const dispatch = useDispatch();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const username = useSelector((state: RootState) => state.auth.user?.username);
//   const messages = useSelector((state: RootState) =>
//     selectMessages(state, roomChatId)
//   );
//   const failedMessages = useSelector((state: RootState) =>
//     selectFailedMessages(state, roomChatId)
//   );
//   const [page, setPage] = useState(1);
//   const { data, isLoading } = useGetMessagesByRoomQuery({
//     roomChatId,
//     page,
//     size: 10,
//   });

//   const updateMessages = useCallback(() => {
//     if (data?.messageDTOs) {
//       failedMessages.forEach((failedMessage) => {
//         const existingMessageIndex = data.messageDTOs.findIndex(
//           (messageDTO) => messageDTO.messengerId === failedMessage.messengerId
//         );
//         if (existingMessageIndex === -1) {
//           dispatch(addFailedMessage(failedMessage));
//         }
//       });
//     }
//   }, [data, dispatch, messages, failedMessages]);

//   useEffect(() => {
//     updateMessages();
//   }, [updateMessages]);

//   const handleSendMessage = async (content: string) => {
//     if (!token || !username) return;

//     const message: MessageDTO = {
//       messengerId: Date.now().toString(),
//       content,
//       senderUsername: username,
//       date: new Date().toISOString(),
//       usernameSenderDelete: false,
//       usernameReceiverDelete: false,
//       roomChatId,
//     };

//     try {
//       const message_ = {
//         ...message,
//         receiverUsername: receiverUsername,
//       };
//       await sendMessage(message_);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       dispatch(addFailedMessage(message));
//     }
//   };

//   const handleLoadMore = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-grow overflow-y-auto">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <ChatMessages
//               messages={messages}
//               failedMessages={failedMessages}
//               currentUsername={username!}
//             />
//             {data && data.totalPage > page && (
//               <button className="text-blue-500" onClick={handleLoadMore}>
//                 Load more
//               </button>
//             )}
//           </>
//         )}
//       </div>
//       <div className="mt-4">
//         <ChatInput onSendMessage={handleSendMessage} />
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;
