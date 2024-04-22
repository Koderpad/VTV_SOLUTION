import { useContext } from "react";
import { FilterContext } from "../../FilterContext";

export const SearchItemResultItems = () => {
  const { filters } = useContext(FilterContext);
  const { rating, minPrice, maxPrice, location } = filters;
  console.log(rating, minPrice, maxPrice, location);

  return (
    <div
      className="
  grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
  "
    ></div>
  );
};
