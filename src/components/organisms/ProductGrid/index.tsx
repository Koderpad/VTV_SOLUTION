import { FilterProvider } from "./FilterContext";
import { FilterPanel } from "./FilterPanel";
import { SearchItemResult } from "./SearchItemResult";

export const ProductGrid = () => {
  return (
    <FilterProvider>
      {/* <div className="mx-auto items-center p-4"> */}
      <div className="flex gap-5 w-full">
        <div className="hidden flex-initial md:block">
          <FilterPanel />
        </div>
        <div className="grow">
          <SearchItemResult />
        </div>
      </div>
      {/* </div> */}
    </FilterProvider>
  );
};
