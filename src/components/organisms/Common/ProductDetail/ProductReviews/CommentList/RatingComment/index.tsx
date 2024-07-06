import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  MoreVertical,
  Trash,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { Rating } from "@/components/molecules/Rating";
import { useUser } from "@/hooks/useUser";
import {
  useAddNewCommentByCustomerMutation,
  useDeleteCommentByCustomerMutation,
} from "@/redux/features/common/comment/commentApiSlice";
import { useDeleteReviewMutation } from "@/redux/features/common/review/reviewApiSlice";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { toast } from "react-toastify";
import {
  ReviewDTO,
  CommentDTO,
} from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
import { ReviewResponse } from "@/utils/DTOs/common/Review/Response/ReviewResponse";
import { CommentResponse } from "@/utils/DTOs/common/Comment/Response/CommentResponse";
import { ServerError } from "@/utils/DTOs/common/ServerError";

export const RatingComment: React.FC<{
  review: ReviewDTO;
  refetchReview: () => void;
}> = ({ review, refetchReview }) => {
  const user = useUser();
  const [showFullText, setShowFullText] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [deleteReview] = useDeleteReviewMutation();
  const [addNewComment] = useAddNewCommentByCustomerMutation();

  const toggleFullText = () => setShowFullText(!showFullText);
  const toggleComments = () => setShowComments(!showComments);
  const handleReplyClick = () => setShowCommentForm(true);

  const handleCommentSubmit = async (commentData: {
    content: string;
    reviewId: string;
  }) => {
    handleApiCall<CommentResponse, ServerError>({
      callbackFn: async () => await addNewComment(commentData),
      successCallback: (data) => {
        setShowCommentForm(false);
        toast.success(data.message);
        refetchReview();
      },
      errorFromServerCallback(error) {
        toast.error(error.message);
      },
      errorSerializedCallback(error) {
        toast.error(error.message);
      },
      errorCallback: (error) => {
        toast.error("Không thể thêm bình luận: " + error);
        setShowCommentForm(false);
      },
    });
  };

  const handleDeleteReview = async () => {
    handleApiCall<ReviewResponse, ServerError>({
      callbackFn: async () => await deleteReview(review.reviewId),
      successCallback: (data) => {
        toast.success(data.message);
        refetchReview();
      },
      errorFromServerCallback(error) {
        toast.error(error.message);
      },
      errorSerializedCallback(error) {
        toast.error(error.message);
      },
      errorCallback: (error) => {
        toast.error("Không thể xóa đánh giá: " + error);
      },
    });
  };

  const displayText = showFullText
    ? review.content
    : `${review.content.slice(0, 100)}...`;
  const commentCount = review.commentDTOs.length;

  return (
    <article className="flex flex-col max-w-xl mb-8">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            className="w-10 h-10 me-4 rounded-full"
            src={review.avatar || "/default-avatar.png"}
            alt=""
          />
          <div className="font-medium dark:text-white">
            <p>
              {review.username}
              <time className="block text-sm text-gray-500 dark:text-gray-400">
                Đánh giá vào {new Date(review.createdAt).toLocaleDateString()}
              </time>
            </p>
          </div>
        </div>
        {user?.username === review.username && (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <MoreVertical
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={handleDeleteReview}
                    >
                      <Trash className="w-5 h-5 mr-2" aria-hidden="true" />
                      Xóa đánh giá
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>
      <div className="flex items-center ml-14 mb-1 space-x-1 rtl:space-x-reverse">
        <Rating rating={review.rating} />
      </div>
      <p className="ml-14 mb-2 text-sm text-gray-500">{displayText}</p>
      {review.content.length > 100 && (
        <button
          onClick={toggleFullText}
          className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          {showFullText ? "Ẩn bớt" : "Xem thêm"}
        </button>
      )}
      {review.image && (
        <img
          className="ml-14 w-[90px] h-[90px] object-cover rounded-lg"
          src={review.image}
          alt="Ảnh đánh giá"
        />
      )}
      <aside>
        <div className="flex items-center pl-14 mt-3">
          {user?.username === review.username && (
            <button
              className="text-sm font-medium text-blue-600 hover:underline border-gray-200 md:mb-0"
              onClick={handleReplyClick}
            >
              Trả lời
            </button>
          )}
        </div>
      </aside>
      {commentCount > 0 && (
        <button
          onClick={toggleComments}
          className="flex items-center mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          {showComments ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Ẩn bình luận
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Hiện {commentCount} bình luận
            </>
          )}
        </button>
      )}
      {showComments && (
        <div className="mt-4 space-y-4">
          {review.commentDTOs.map((comment) => (
            <CommentReply
              key={comment.commentId}
              comment={comment}
              currentUser={user}
              refetchReview={refetchReview}
            />
          ))}
        </div>
      )}
      {showCommentForm && (
        <CommentForm
          reviewId={review.reviewId}
          onSubmit={handleCommentSubmit}
          onCancel={() => setShowCommentForm(false)}
        />
      )}
    </article>
  );
};

export const CommentReply: React.FC<{
  comment: CommentDTO;
  currentUser: any;
  refetchReview: () => void;
}> = ({ comment, currentUser, refetchReview }) => {
  const [deleteCommentByCustomer] = useDeleteCommentByCustomerMutation();

  const handleDeleteComment = async () => {
    handleApiCall<CommentResponse, ServerError>({
      callbackFn: async () => await deleteCommentByCustomer(comment.commentId),
      successCallback: (data) => {
        toast.success(data.message);
        refetchReview();
      },
      errorFromServerCallback(error) {
        toast.error(error.message);
      },
      errorSerializedCallback(error) {
        toast.error(error.message);
      },
      errorCallback: (error) => {
        toast.error("Không thể xóa bình luận: " + error);
      },
    });
  };

  return (
    <div className="ml-14 mt-4">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <img
            className="w-8 h-8 me-2 rounded-full"
            src={comment.avatar || "/default-avatar.png"}
            alt=""
          />
          <div className="font-medium dark:text-white">
            <p>
              {comment.shopName || comment.username}
              {comment.shopName && (
                <span className="ml-2 text-sm text-gray-500">
                  (Tài khoản cửa hàng)
                </span>
              )}
            </p>
          </div>
        </div>
        {currentUser?.username === comment.username && (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              <MoreVertical
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={handleDeleteComment}
                    >
                      <Trash className="w-5 h-5 mr-2" aria-hidden="true" />
                      Xóa bình luận
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        )}
      </div>
      <p className="text-sm text-gray-500">{comment.content}</p>
      <p className="text-xs text-gray-400">{comment.createDate}</p>
    </div>
  );
};

export const CommentForm: React.FC<{
  reviewId: string;
  onSubmit: (commentData: { content: string; reviewId: string }) => void;
  onCancel: () => void;
}> = ({ reviewId, onSubmit, onCancel }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content, reviewId });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="ml-14 mt-4">
      <textarea
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
        rows={4}
        placeholder="Viết bình luận..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          className="px-4 py-2 mr-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
        >
          Gửi
        </button>
      </div>
    </form>
  );
};

// import React, { useState } from "react";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import {
//   MoreVertical,
//   Trash,
//   ChevronDown,
//   ChevronUp,
//   Star,
// } from "lucide-react";
// import { Rating } from "@/components/molecules/Rating";
// import { useUser } from "@/hooks/useUser";
// import {
//   useAddNewCommentByCustomerMutation,
//   useDeleteCommentByCustomerMutation,
// } from "@/redux/features/common/comment/commentApiSlice";
// import { useDeleteReviewMutation } from "@/redux/features/common/review/reviewApiSlice";
// import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
// import { toast } from "react-toastify";
// import {
//   ReviewDTO,
//   CommentDTO,
// } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
// import { ReviewResponse } from "@/utils/DTOs/common/Review/Response/ReviewResponse";
// import { CommentResponse } from "@/utils/DTOs/common/Comment/Response/CommentResponse";
// import { ServerError } from "@/utils/DTOs/common/ServerError";

// export const RatingComment: React.FC<{
//   review: ReviewDTO;
//   refetchReview: () => void;
// }> = ({ review, refetchReview }) => {
//   const user = useUser();
//   const [showFullText, setShowFullText] = useState(false);
//   const [showCommentForm, setShowCommentForm] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [deleteReview] = useDeleteReviewMutation();
//   const [addNewComment] = useAddNewCommentByCustomerMutation();

//   const toggleFullText = () => setShowFullText(!showFullText);
//   const toggleComments = () => setShowComments(!showComments);
//   const handleReplyClick = () => setShowCommentForm(true);

//   const handleCommentSubmit = async (commentData: {
//     content: string;
//     reviewId: string;
//   }) => {
//     handleApiCall<CommentResponse, ServerError>({
//       callbackFn: async () => await addNewComment(commentData),
//       successCallback: (data) => {
//         setShowCommentForm(false);
//         toast.success(data.message);
//         refetchReview();
//       },
//       errorFromServerCallback(error) {
//         toast.error(error.message);
//       },
//       errorSerializedCallback(error) {
//         toast.error(error.message);
//       },
//       errorCallback: (error) => {
//         toast.error("Failed to add comment: " + error);
//         setShowCommentForm(false);
//       },
//     });
//   };

//   const handleDeleteReview = async () => {
//     handleApiCall<ReviewResponse, ServerError>({
//       callbackFn: async () => await deleteReview(review.reviewId),
//       successCallback: (data) => {
//         toast.success(data.message);
//         refetchReview();
//       },
//       errorFromServerCallback(error) {
//         toast.error(error.message);
//       },
//       errorSerializedCallback(error) {
//         toast.error(error.message);
//       },
//       errorCallback: (error) => {
//         toast.error("Failed to delete review: " + error);
//       },
//     });
//   };

//   const displayText = showFullText
//     ? review.content
//     : `${review.content.slice(0, 100)}...`;
//   const commentCount = review.commentDTOs.length;

//   return (
//     <article className="flex flex-col max-w-xl mb-8">
//       <div className="flex items-center mb-4 justify-between">
//         <div className="flex items-center">
//           <img
//             className="w-10 h-10 me-4 rounded-full"
//             src={review.avatar || "/default-avatar.png"}
//             alt=""
//           />
//           <div className="font-medium dark:text-white">
//             <p>
//               {review.username}
//               <time className="block text-sm text-gray-500 dark:text-gray-400">
//                 Reviewed on {new Date(review.createdAt).toLocaleDateString()}
//               </time>
//             </p>
//           </div>
//         </div>
//         {user?.username === review.username && (
//           <Menu as="div" className="relative inline-block text-left">
//             <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
//               <MoreVertical
//                 className="w-5 h-5 text-gray-400"
//                 aria-hidden="true"
//               />
//             </MenuButton>
//             <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//               <div className="px-1 py-1">
//                 <MenuItem>
//                   {({ active }) => (
//                     <button
//                       className={`${
//                         active ? "bg-red-500 text-white" : "text-gray-900"
//                       } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                       onClick={handleDeleteReview}
//                     >
//                       <Trash className="w-5 h-5 mr-2" aria-hidden="true" />
//                       Delete review
//                     </button>
//                   )}
//                 </MenuItem>
//               </div>
//             </MenuItems>
//           </Menu>
//         )}
//       </div>
//       <div className="flex items-center ml-14 mb-1 space-x-1 rtl:space-x-reverse">
//         <Rating rating={review.rating} />
//       </div>
//       <p className="ml-14 mb-2 text-sm text-gray-500">{displayText}</p>
//       {review.content.length > 100 && (
//         <button
//           onClick={toggleFullText}
//           className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
//         >
//           {showFullText ? "Show less" : "Show more"}
//         </button>
//       )}
//       {review.image && (
//         <img
//           className="ml-14 w-[90px] h-[90px] object-cover rounded-lg"
//           src={review.image}
//           alt="Review"
//         />
//       )}
//       <aside>
//         <div className="flex items-center pl-14 mt-3">
//           {user?.username === review.username && (
//             <button
//               className="text-sm font-medium text-blue-600 hover:underline border-gray-200 md:mb-0"
//               onClick={handleReplyClick}
//             >
//               Reply
//             </button>
//           )}
//         </div>
//       </aside>
//       {commentCount > 0 && (
//         <button
//           onClick={toggleComments}
//           className="flex items-center mt-4 text-sm font-medium text-blue-600 hover:underline"
//         >
//           {showComments ? (
//             <>
//               <ChevronUp className="w-4 h-4 mr-1" />
//               Hide comments
//             </>
//           ) : (
//             <>
//               <ChevronDown className="w-4 h-4 mr-1" />
//               Show {commentCount} comments
//             </>
//           )}
//         </button>
//       )}
//       {showComments && (
//         <div className="mt-4 space-y-4">
//           {review.commentDTOs.map((comment) => (
//             <CommentReply
//               key={comment.commentId}
//               comment={comment}
//               currentUser={user}
//               refetchReview={refetchReview}
//             />
//           ))}
//         </div>
//       )}
//       {showCommentForm && (
//         <CommentForm
//           reviewId={review.reviewId}
//           onSubmit={handleCommentSubmit}
//           onCancel={() => setShowCommentForm(false)}
//         />
//       )}
//     </article>
//   );
// };

// export const CommentReply: React.FC<{
//   comment: CommentDTO;
//   currentUser: any;
//   refetchReview: () => void;
// }> = ({ comment, currentUser, refetchReview }) => {
//   const [deleteCommentByCustomer] = useDeleteCommentByCustomerMutation();

//   const handleDeleteComment = async () => {
//     handleApiCall<CommentResponse, ServerError>({
//       callbackFn: async () => await deleteCommentByCustomer(comment.commentId),
//       successCallback: (data) => {
//         toast.success(data.message);
//         refetchReview();
//       },
//       errorFromServerCallback(error) {
//         toast.error(error.message);
//       },
//       errorSerializedCallback(error) {
//         toast.error(error.message);
//       },
//       errorCallback: (error) => {
//         toast.error("Failed to delete comment: " + error);
//       },
//     });
//   };

//   return (
//     <div className="ml-14 mt-4">
//       <div className="flex items-center mb-2 justify-between">
//         <div className="flex items-center">
//           <img
//             className="w-8 h-8 me-2 rounded-full"
//             src={comment.avatar || "/default-avatar.png"}
//             alt=""
//           />
//           <div className="font-medium dark:text-white">
//             <p>
//               {comment.shopName || comment.username}
//               {comment.shopName && (
//                 <span className="ml-2 text-sm text-gray-500">
//                   (Shop account)
//                 </span>
//               )}
//             </p>
//           </div>
//         </div>
//         {currentUser?.username === comment.username && (
//           <Menu as="div" className="relative inline-block text-left">
//             <MenuButton className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
//               <MoreVertical
//                 className="w-5 h-5 text-gray-400"
//                 aria-hidden="true"
//               />
//             </MenuButton>
//             <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//               <div className="px-1 py-1">
//                 <MenuItem>
//                   {({ active }) => (
//                     <button
//                       className={`${
//                         active ? "bg-red-500 text-white" : "text-gray-900"
//                       } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
//                       onClick={handleDeleteComment}
//                     >
//                       <Trash className="w-5 h-5 mr-2" aria-hidden="true" />
//                       Delete comment
//                     </button>
//                   )}
//                 </MenuItem>
//               </div>
//             </MenuItems>
//           </Menu>
//         )}
//       </div>
//       <p className="text-sm text-gray-500">{comment.content}</p>
//       <p className="text-xs text-gray-400">{comment.createDate}</p>
//     </div>
//   );
// };

// export const CommentForm: React.FC<{
//   reviewId: string;
//   onSubmit: (commentData: { content: string; reviewId: string }) => void;
//   onCancel: () => void;
// }> = ({ reviewId, onSubmit, onCancel }) => {
//   const [content, setContent] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({ content, reviewId });
//     setContent("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="ml-14 mt-4">
//       <textarea
//         className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
//         rows={4}
//         placeholder="Write a comment..."
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />
//       <div className="flex justify-end mt-2">
//         <button
//           type="button"
//           className="px-4 py-2 mr-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700"
//           onClick={onCancel}
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
//         >
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// };
