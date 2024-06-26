import { Rating } from "@/components/molecules/Rating";
import { FilterGroup } from "..";
import { useContext } from "react";
import { FilterContext } from "../../../FilterContext";

export const FilterRating = () => {
  const { filters, updateFilters } = useContext(FilterContext);

  const handleRatingChange = (rating: number) => {
    updateFilters({ rating: [rating] });
  };

  const isRatingChecked = (rating: number) => {
    return filters.rating.includes(rating);
  };

  const ui = (
    <ul className="flex flex-col gap-3 px-2.5 pb-2.5">
      {[3, 4, 4.5].map((rating) => (
        <li key={rating} className="flex items-center gap-3">
          <input
            id={String(rating)}
            name={String(rating)}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-violet-700 focus:ring-violet-700"
            checked={isRatingChecked(rating)}
            onChange={() => handleRatingChange(rating)}
          />
          <label htmlFor={String(rating)} className="flex items-center gap-3">
            <Rating rating={rating} />
            <span className="text-sm font-medium">{rating}+</span>
          </label>
        </li>
      ))}
    </ul>
  );

  return <FilterGroup name="PRODUCT RATE">{ui}</FilterGroup>;
};
