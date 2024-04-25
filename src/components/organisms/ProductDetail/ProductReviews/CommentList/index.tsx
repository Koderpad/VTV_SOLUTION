import { RatingComment } from "./RatingComment";

export const CommentList = () => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <RatingComment />
      <RatingComment />
      <RatingComment />
      <RatingComment />
      <RatingComment />
    </div>
  );
};
