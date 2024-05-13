import { useContext } from "react";
import { FilterGroup } from "..";
import { FilterContext } from "../../../FilterContext";

export const FilterPrice = () => {
  const { filters, updateFilters } = useContext(FilterContext);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value ? Number(value) : null });
  };

  return (
    <FilterGroup name="PRICE">
      <div className="flex flex-col gap-3 px-2.5 pb-2.5">
        <div className="flex items-center gap-3">
          <label htmlFor="fromPrice" className="text-sm font-medium">
            From:
          </label>
          <input
            id="fromPrice"
            name="fromPrice"
            type="number"
            className="w-full rounded border-gray-300 text-sm focus:ring-violet-700"
            value={filters.fromPrice || ""}
            onChange={handlePriceChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="toPrice" className="text-sm font-medium">
            To:
          </label>
          <input
            id="toPrice"
            name="toPrice"
            type="number"
            className="w-full rounded border-gray-300 text-sm focus:ring-violet-700"
            value={filters.toPrice || ""}
            onChange={handlePriceChange}
          />
        </div>
      </div>
    </FilterGroup>
  );
};
