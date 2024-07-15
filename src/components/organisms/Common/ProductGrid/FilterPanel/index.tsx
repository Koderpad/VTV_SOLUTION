import { FilterPrice } from "./FilterGroup/FilterPrice";
import { FilterRating } from "./FilterGroup/FilterRating";
import { FilterSort } from "./FilterGroup/FilterSort";

export const FilterPanel = () => {
  return (
    <div>
      <div className="flex flex-col gap-2 rounded-lg bg-white p-2">
        {/* <FilterRating /> */}
        <FilterPrice />
        <FilterSort />
      </div>
    </div>
  );
};
