import { Rating } from "@/components/molecules/Rating";
import { CommentDTO, ReviewDTO } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
import { useState } from "react";

const CommentReply = ({ comment }:{comment:CommentDTO}) => {
  return (
    <div className="ml-14 mt-4">
      <div className="flex items-center mb-2">
        <img
          className="w-8 h-8 me-2 rounded-full"
          src="https://icons8.com/icon/110057/person-zu-hause"
          alt=""
        />
        <div className="font-medium dark:text-white">
          <p>{comment.shopName}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">{comment.content}</p>
      <p className="text-xs text-gray-400">{comment.createDate}</p>
    </div>
  );
};

export const RatingComment = ({ review }:{review:ReviewDTO}) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText ? review.content : `${review.content.slice(0, 100)}...`;

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
            <time dateTime={review.createdAt} className="block text-sm text-gray-500 dark:text-gray-400">
              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
            </time>
          </p>
        </div>
      </div>
      <div className="flex items-center ml-14 mb-1 space-x-1 rtl:space-x-reverse">
        <Rating rating={review.rating} />
      </div>
      <p className="ml-14 mb-2 text-sm text-gray-500">{displayText}</p>
      {review.content.length > 100 && !showFullText && (
        <button
          onClick={toggleFullText}
          className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Read more
        </button>
      )}
      {showFullText && (
        <button
          onClick={toggleFullText}
          className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          Read less
        </button>
      )}
      {review.image && (
        <img className="ml-14 w-[90px] h-[90px] object-cover rounded-lg" src={review.image} alt="" />
      )}
      <aside>
        <div className="flex items-center pl-14 mt-3">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline border-gray-200 md:mb-0">
            Report abuse
          </a>
        </div>
      </aside>
      {review.commentDTOs.map((comment) => (
        <CommentReply key={comment.commentId} comment={comment} />
      ))}
      <div className="my-4 h-px w-full bg-neutral-200"></div>
    </article>
  );
};
