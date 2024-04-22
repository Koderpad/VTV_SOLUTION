import { FilterProvider } from "./FilterContext";
import { FilterPanel } from "./FilterPanel";
import { SearchItemResult } from "./SearchItemResult";
import { SearchItemResultItems } from "./SearchItemResult/SearchItemResultItems";

export const ProductGrid = () => {
  return (
    <FilterProvider>
      <div className="mx-auto items-center p-4">
        <div className="flex gap-5">
          <div className="hidden flex-1 md:block">
            <FilterPanel />
          </div>
          <div className="flex-[5]">
            <SearchItemResult />
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};
