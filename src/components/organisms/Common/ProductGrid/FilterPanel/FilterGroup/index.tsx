import { FC, useContext, useEffect, useState } from "react";
import { FilterContext } from "../../FilterContext";

interface FilterGroupProps {
  name: string;
  children: React.ReactNode;
}

export const FilterGroup: FC<FilterGroupProps> = ({ name, children }) => {
  const { filters } = useContext(FilterContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const shouldOpen = () => {
      switch (name) {
        case "PRICE":
          return filters.fromPrice !== null || filters.toPrice !== null;
        case "PRODUCT RATE":
          return filters.rating.length > 0;
        case "SORT BY":
          return filters.sortBy !== null;
        default:
          return false;
      }
    };

    setIsOpen(shouldOpen());
  }, [filters, name]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="rounded-lg bg-neutral-100">
      <button
        className="flex w-full items-center justify-between px-2.5 py-2.5 gap-4 text-sm font-semibold text-neutral-600"
        onClick={toggleDropdown}
      >
        <span className="flex w-auto whitespace-nowrap">{name}</span>

        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={` duration-200 ${isOpen ? "transition rotate-180" : "transition-transform rotate-0"}`}
          height="1rem"
          width="1rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div
        className={`transition-all duration-200 ease-in-out ${isOpen ? "h-auto" : "h-0 overflow-hidden"}`}
        aria-hidden={!isOpen}
      >
        <div
          className={`${isOpen ? "transition-opacity duration-200 ease-in" : "opacity-0 hidden transition-opacity duration-200 ease-in"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
