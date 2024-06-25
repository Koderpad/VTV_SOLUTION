import { FilterProvider } from "./FilterContext";
import { FilterPanel } from "./FilterPanel";
import { ProductResultsContainer } from "@/features/common/product/productsBy/ProductResultsContainer";

export const ProductGrid = () => {
  return (
    <FilterProvider>
      <div className="flex gap-5 w-full">
        <div className="hidden flex-initial md:block">
          <FilterPanel />
        </div>
        <div className="grow">
          <ProductResultsContainer />
        </div>
      </div>
    </FilterProvider>
  );
};
