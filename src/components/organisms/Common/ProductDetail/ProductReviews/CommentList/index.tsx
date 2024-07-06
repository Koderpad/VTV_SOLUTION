import { ReviewDTO } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
import { RatingComment } from "./RatingComment";

export const CommentList = ({ reviews }: { reviews: ReviewDTO[] }) => {
  return (
    <div className="flex flex-col w-full space-y-4">
      {/* {reviews.map((review) => (
        <RatingComment key={review.reviewId} review={review} />
      ))} */}
    </div>
  );
};
