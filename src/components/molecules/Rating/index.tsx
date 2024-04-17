import React from "react";
import { Star, StarProps } from "@/components/atoms/Icon/Star"; // Update the import path as necessary

interface RatingProps {
  rating: number; // A float or integer number to represent the rating
  starProps?: Omit<StarProps, "typeStar">; // Props to pass to the Star component
}

export const Rating: React.FC<RatingProps> = ({ rating, starProps }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex gap-1">
      {Array.from({ length: fullStars }, (_, index) => (
        <Star key={index} typeStar="filled" {...starProps} />
      ))}
      {halfStar === 1 && <Star typeStar="half" {...starProps} />}
      {Array.from({ length: emptyStars }, (_, index) => (
        <Star
          key={fullStars + halfStar + index}
          typeStar="empty"
          {...starProps}
        />
      ))}
    </div>
  );
};

// import React from "react";
// import { Star, StarProps } from "@/components/atoms/Icon/Star"; // Assuming the path to your Star component

// interface RatingProps {
//   rating: number; // A float or integer number to represent the rating
//   starProps?: Omit<StarProps, "typeStar">; // Props to pass to the Star component
// }

// export const Rating: React.FC<RatingProps> = ({ rating, starProps }) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5 ? 1 : 0;
//   const emptyStars = 5 - fullStars - halfStar;

//   return (
//     <div className="flex gap-1">
//       {Array.from({ length: fullStars }, (_, index) => (
//         <Star key={index} typeStar="filled" {...starProps} />
//       ))}
//       {halfStar === 1 && <Star typeStar="half" {...starProps} />}
//       {Array.from({ length: emptyStars }, (_, index) => (
//         <Star
//           key={fullStars + halfStar + index}
//           typeStar="empty"
//           {...starProps}
//         />
//       ))}
//     </div>
//   );
// };
