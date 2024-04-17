import { FilterPanel } from "./FilterPanel";

export const ProductGrid = () => {
  return (
    <div className="mx-auto items-center p-4">
      <div className="flex gap-5">
        <div className="hidden flex-1 md:block">
          <FilterPanel />
        </div>
        <div className="flex-[5]">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
            <div>sp1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
