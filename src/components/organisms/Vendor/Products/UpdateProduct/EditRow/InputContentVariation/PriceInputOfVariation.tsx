export const PriceInputOfVariation = () => {
  return (
    <div>
      <div className="relative w-full">
        <input
          type="text"
          id="hs-inline-leading-pricing-select-label"
          name="inline-add-on"
          className="py-3 px-4 ps-9 pe-20 block w-full border border-gray-300 shadow-sm rounded-lg text-2xl focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
          placeholder="0"
        />
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
          <span className="text-gray-500 font-mono">₫</span>
        </div>
        <div className="absolute inset-y-0 end-0 flex items-center text-gray-500 pe-px"></div>
      </div>
    </div>
  );
};
