import { FilterRating } from "./FilterGroup/FilterRating/index-temp";

export const FilterPanel = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 rounded-lg bg-white p-2">
        <FilterRating />
        <FilterRating />
        <FilterRating />
        <FilterRating />
        <FilterRating />
        <FilterRating />
        <FilterRating />
      </div>
    </div>
  );
};
