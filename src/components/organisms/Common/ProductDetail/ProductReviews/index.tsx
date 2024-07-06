import React from "react";
import { useGetReviewListByProductIdQuery } from "@/redux/features/common/review/reviewApiSlice";
import { useParams } from "react-router-dom";
import { AdvancedRating } from "./AdvancedRating";
import { RatingComment } from "./CommentList/RatingComment";

export const ProductReviews: React.FC = () => {
  const { productId } = useParams();

  if (!productId) {
    return null;
  }

  const {
    data: reviews,
    isLoading,
    refetch: refetchReviews,
  } = useGetReviewListByProductIdQuery(parseInt(productId));

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!reviews || reviews.count === 0) {
    return (
      <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
        <h1 className="text-2xl font-semibold">Đánh giá</h1>
        <p className="text-gray-500 mt-4">
          Chưa có đánh giá và bình luận nào cho sản phẩm này.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
      <h1 className="text-2xl font-semibold">Đánh giá</h1>
      <div className="flex flex-col md:flex-row">
        <AdvancedRating reviews={reviews} />
        <div className="flex-1">
          <div className="flex flex-col w-full space-y-4">
            {reviews.reviewDTOs.map((review) => (
              <RatingComment
                key={review.reviewId}
                review={review}
                refetchReview={refetchReviews}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// import React from "react";
// import { useGetReviewListByProductIdQuery } from "@/redux/features/common/review/reviewApiSlice";
// import { useParams } from "react-router-dom";
// import { AdvancedRating } from "./AdvancedRating";
// import { RatingComment } from "./CommentList/RatingComment";

// export const ProductReviews: React.FC = () => {
//   const { productId } = useParams();

//   if (!productId) {
//     return null;
//   }

//   const {
//     data: reviews,
//     isLoading,
//     refetch: refetchReviews,
//   } = useGetReviewListByProductIdQuery(parseInt(productId));

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!reviews) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
//       <h1 className="text-2xl font-semibold">Reviews</h1>
//       <div className="flex flex-col md:flex-row">
//         <AdvancedRating reviews={reviews} />
//         <div className="flex-1">
//           <div className="flex flex-col w-full space-y-4">
//             {reviews.reviewDTOs.map((review) => (
//               <RatingComment
//                 key={review.reviewId}
//                 review={review}
//                 refetchReview={refetchReviews}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
