import { AdvancedRating } from "./AdvancedRating";
import { CommentList } from "./CommentList";

export const ProductReviews = () => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <AdvancedRating />
      <CommentList />
    </div>
  );
};
