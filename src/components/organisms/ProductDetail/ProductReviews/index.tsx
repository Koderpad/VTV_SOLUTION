import { AdvancedRating } from "./AdvancedRating";
import { CommentList } from "./CommentList";

export const ProductReviews = () => {
  return (
    // <div className="flex flex-col w-full space-y-4">
    <div className="flex flex-col mt-4 rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:gap-8 w-full">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <div className="flex flex-row">
        <AdvancedRating />
        <CommentList />
      </div>
    </div>
  );
};
