import { Rating } from "@/components/molecules/Rating";
import { useUser } from "@/hooks/useUser";
import { useAddNewCommentByCustomerMutation } from "@/redux/features/common/comment/commentApiSlice";
import { CommentResponse } from "@/utils/DTOs/common/Comment/Response/CommentResponse";
import {
  CommentDTO,
  ReviewDTO,
} from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CommentReply = ({ comment }: { comment: CommentDTO }) => {
  return (
    <div className="ml-14 mt-4">
      <div className="flex items-center mb-2">
        <img
          className="w-8 h-8 me-2 rounded-full"
          src="https://icons8.com/icon/110057/person-zu-hause"
          alt=""
        />
        <div className="font-medium dark:text-white">
          <p>{comment.shopName || comment.username}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">{comment.content}</p>
      <p className="text-xs text-gray-400">{comment.createDate}</p>
    </div>
  );
};

const CommentForm = ({
  reviewId,
  onSubmit,
  onCancel,
}: {
  reviewId: string;
  onSubmit: (commentData: { content: string; reviewId: string }) => void;
  onCancel: () => void;
}) => {
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
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-end mt-2">
        <button
          type="button"
          className="px-4 py-2 mr-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export const RatingComment = ({ review }: { review: ReviewDTO }) => {
  const user = useUser();
  const [showFullText, setShowFullText] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [addNewComment] = useAddNewCommentByCustomerMutation();

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  const handleReplyClick = () => {
    setShowCommentForm(true);
  };

  const handleCommentSubmit = async (commentData: {
    content: string;
    reviewId: string;
  }) => {
    handleApiCall<CommentResponse, ServerError>({
      callbackFn: async () => {
        return await addNewComment(commentData);
      },
      successCallback(data) {
        setShowCommentForm(false);
        // Update the UI with the new comment
        toast.success("Comment added successfully!");
        //update comment list to show new comment
      },
      errorFromServerCallback(error) {
        console.error("Failed to add comment:", error);
        toast.error(error.message);
        setShowCommentForm(false);
      },
      errorSerializedCallback(error) {
        console.error("Failed to add comment:", error);
      },
      errorCallback(error) {
        console.error("Failed to add comment:", error);
      },
    });
    // try {
    //   await addNewComment(commentData).unwrap();
    //   setShowCommentForm(false);
    //   // Update the UI with the new comment
    // } catch (error) {
    //   console.error("Failed to add comment:", error);
    // }
  };

  const handleCommentCancel = () => {
    setShowCommentForm(false);
  };

  const displayText = showFullText
    ? review.content
    : `${review.content.slice(0, 100)}...`;

  return (
    <article className="flex flex-col max-w-xl">
      <div className="flex items-center mb-4">
        <img
          className="w-10 h-10 me-4 rounded-full"
          src="https://icons8.com/icon/110057/person-zu-hause"
          alt=""
        />
        <div className="font-medium dark:text-white">
          <p>
            {review.username}{" "}
            <time
              dateTime={review.createdAt}
              className="block text-sm text-gray-500 dark:text-gray-400"
            >
              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
            </time>
          </p>
        </div>
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
          {showFullText ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
      {review.image && (
        <img
          className="ml-14 w-[90px] h-[90px] object-cover rounded-lg"
          src={review.image}
          alt=""
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
      {review.commentDTOs.map((comment) => (
        <CommentReply key={comment.commentId} comment={comment} />
      ))}
      {showCommentForm && (
        <CommentForm
          reviewId={review.reviewId}
          onSubmit={handleCommentSubmit}
          onCancel={handleCommentCancel}
        />
      )}
      <div className="my-4 h-px w-full bg-neutral-200"></div>
      <ToastContainer />
    </article>
  );
};
// import { Rating } from "@/components/molecules/Rating";
// import { useUser } from "@/hooks/useUser";
// import {
//   CommentDTO,
//   ReviewDTO,
// } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
// import { useState } from "react";
//
// const CommentReply = ({ comment }: { comment: CommentDTO }) => {
//   return (
//     <div className="ml-14 mt-4">
//       <div className="flex items-center mb-2">
//         <img
//           className="w-8 h-8 me-2 rounded-full"
//           src="https://icons8.com/icon/110057/person-zu-hause"
//           alt=""
//         />
//         <div className="font-medium dark:text-white">
//           <p>{comment.shopName || comment.username}</p>
//         </div>
//       </div>
//       <p className="text-sm text-gray-500">{comment.content}</p>
//       <p className="text-xs text-gray-400">{comment.createDate}</p>
//     </div>
//   );
// };
//
// export const RatingComment = ({ review }: { review: ReviewDTO }) => {
//   const user = useUser();
//   const [showFullText, setShowFullText] = useState(false);
//
//   const toggleFullText = () => {
//     setShowFullText(!showFullText);
//   };
//
//   const displayText = showFullText
//     ? review.content
//     : `${review.content.slice(0, 100)}...`;
//
//   return (
//     <article className="flex flex-col max-w-xl">
//       <div className="flex items-center mb-4">
//         <img
//           className="w-10 h-10 me-4 rounded-full"
//           src="https://icons8.com/icon/110057/person-zu-hause"
//           alt=""
//         />
//         <div className="font-medium dark:text-white">
//           <p>
//             {review.username}{" "}
//             <time
//               dateTime={review.createdAt}
//               className="block text-sm text-gray-500 dark:text-gray-400"
//             >
//               Reviewed on {new Date(review.createdAt).toLocaleDateString()}
//             </time>
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center ml-14 mb-1 space-x-1 rtl:space-x-reverse">
//         <Rating rating={review.rating} />
//       </div>
//       <p className="ml-14 mb-2 text-sm text-gray-500">{displayText}</p>
//       {review.content.length > 100 && !showFullText && (
//         <button
//           onClick={toggleFullText}
//           className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
//         >
//           Xem thêm
//         </button>
//       )}
//       {showFullText && (
//         <button
//           onClick={toggleFullText}
//           className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
//         >
//           Thu gọn
//         </button>
//       )}
//       {review.image && (
//         <img
//           className="ml-14 w-[90px] h-[90px] object-cover rounded-lg"
//           src={review.image}
//           alt=""
//         />
//       )}
//       <aside>
//         <div className="flex items-center pl-14 mt-3">
//           {user?.username == review.username ? (
//             <a
//               href="#"
//               className="text-sm font-medium text-blue-600 hover:underline border-gray-200 md:mb-0"
//             >
//               Trả lời
//             </a>
//           ) : null}
//         </div>
//       </aside>
//       {review.commentDTOs.map((comment) => (
//         <CommentReply key={comment.commentId} comment={comment} />
//       ))}
//       <div className="my-4 h-px w-full bg-neutral-200"></div>
//     </article>
//   );
// };
