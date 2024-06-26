import { useContext } from "react";
import { FilterGroup } from "..";
import { FilterContext } from "../../../FilterContext";
type SortBy = "newest" | "best-selling" | "price-asc" | "price-desc" | "random";
export const FilterSort = () => {
  const { filters, updateFilters } = useContext(FilterContext);

  const handleSortChange = (sortBy: SortBy) => {
    updateFilters({ sortBy });
  };

  const isSortChecked = (sortBy: SortBy) => {
    return filters.sortBy === sortBy;
  };

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "best-selling", label: "Best Selling" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "random", label: "Random" },
  ];

  return (
    <FilterGroup name="SORT BY">
      <ul className="flex flex-col gap-3 px-2.5 pb-2.5">
        {sortOptions.map(({ value, label }) => (
          <li key={value} className="flex items-center gap-3">
            <input
              id={value}
              name="sortBy"
              type="radio"
              className="h-4 w-4 border-gray-300 text-violet-700 focus:ring-violet-700"
              checked={isSortChecked(value)}
              onChange={() => handleSortChange(value)}
            />
            <label htmlFor={value} className="text-sm font-medium">
              {label}
            </label>
          </li>
        ))}
      </ul>
    </FilterGroup>
  );
};
