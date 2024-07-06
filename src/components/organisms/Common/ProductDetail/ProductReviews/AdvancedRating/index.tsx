import { ListReviewResponse } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";

export const AdvancedRating = ({
  reviews,
}: {
  reviews: ListReviewResponse;
}) => {
  const { count, averageRating } = reviews;

  const ratingPercentages = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.reviewDTOs.filter(
      (review) => review.rating === rating
    ).length;
    return Math.round((count / reviews.count) * 100);
  });

  return (
    <div className="max-w-2xl w-full pb-4">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(averageRating)
                ? "text-yellow-300"
                : "text-gray-300 dark:text-gray-500"
            } me-1`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {averageRating.toFixed(2)}
        </p>
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          trên
        </p>
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          5
        </p>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {count} đánh giá
      </p>
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            {rating} sao
          </a>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
            <div
              className="h-5 bg-yellow-300 rounded"
              style={{
                width: `${ratingPercentages[5 - rating]}%`,
              }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {ratingPercentages[5 - rating]}%
          </span>
        </div>
      ))}
    </div>
  );
};

// import { ListReviewResponse } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";

// export const AdvancedRating = ({ reviews }:{reviews:ListReviewResponse }) => {
//   const { count, averageRating } = reviews;

//   const ratingPercentages = [5, 4, 3, 2, 1].map((rating) => {
//     const count = reviews.reviewDTOs.filter((review) => review.rating === rating).length;
//     return Math.round((count / reviews.count) * 100);
//   });

//   return (
//     <div className="max-w-2xl w-full pb-4">
//       <div className="flex items-center mb-2">
//         {[...Array(5)].map((_, index) => (
//           <svg
//             key={index}
//             className={`w-4 h-4 ${
//               index < Math.floor(averageRating) ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"
//             } me-1`}
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="currentColor"
//             viewBox="0 0 22 20"
//           >
//             <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//           </svg>
//         ))}
//         <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{averageRating.toFixed(2)}</p>
//         <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
//         <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
//       </div>
//       <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{count} global ratings</p>
//       {[5, 4, 3, 2, 1].map((rating) => (
//         <div key={rating} className="flex items-center mt-4">
//           <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">
//             {rating} star
//           </a>
//           <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
//             <div
//               className="h-5 bg-yellow-300 rounded"
//               style={{
//                 width: `${ratingPercentages[5 - rating]}%`,
//               }}
//             ></div>
//           </div>
//           <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{ratingPercentages[5 - rating]}%</span>
//         </div>
//       ))}
//     </div>
//   );
// };
