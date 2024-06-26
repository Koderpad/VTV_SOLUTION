export const SkuInputOfVariation = () => {
  return (
    <div>
      <div className="relative">
        <input
          type="text"
          id="hs-validation-name-error"
          name="hs-validation-name-error"
          className="py-3 pr-10 px-4 block w-full border border-gray-300 rounded-lg text-2xl focus:border-red-600 focus:ring-red-700"
          required
          aria-describedby="hs-validation-name-error-helper"
        />
        <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-3">
          <svg
            className="flex-shrink-0 h-4 w-4 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
      </div>
    </div>
  );
};
