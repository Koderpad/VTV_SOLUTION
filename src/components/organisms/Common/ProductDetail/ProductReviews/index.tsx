import { useGetReviewListByProductIdQuery } from "@/redux/features/common/review/reviewApiSlice";
import { AdvancedRating } from "./AdvancedRating";
import { CommentList } from "./CommentList";
import { useParams } from "react-router-dom";

export const ProductReviews = () => {
  const { productId } = useParams();
  console.log("review of product id: ", productId);
  if (!productId) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: reviews, isLoading } = useGetReviewListByProductIdQuery(
    parseInt(productId),
  );
  console.log("reviews: ", reviews);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!reviews) {
    return null;
  }

  return (
    <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <div className="flex flex-row">
        <AdvancedRating reviews={reviews} />
        <CommentList reviews={reviews.reviewDTOs} />
      </div>
    </div>
  );
};
