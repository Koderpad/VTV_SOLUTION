import { createContext, ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type SortBy = "newest" | "best-selling" | "price-asc" | "price-desc" | "random";

interface Filters {
  fromPrice: number | null;
  toPrice: number | null;
  sortBy: SortBy | null;
  rating: number[];
  page: number; // Add page field to store the current page number
  shop?: string | null;
}

interface FilterContextType {
  filters: Filters;
  updateFilters: (newFilters: Partial<Filters>) => void;
}

export const FilterContext = createContext<FilterContextType>({
  filters: {
    fromPrice: null,
    toPrice: null,
    sortBy: null,
    rating: [],
    page: 1, // Default page number
    shop: null,
  },
  updateFilters: () => {},
});

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const location = useLocation();
  const [filters, setFilters] = useState<Filters>(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      fromPrice: Number(searchParams.get("fromPrice")) || null,
      toPrice: Number(searchParams.get("toPrice")) || null,
      sortBy: (searchParams.get("sortBy") as SortBy) || null,
      rating: searchParams.get("rating")?.split(",").map(Number) || [],
      page: Number(searchParams.get("page")) || 1, // Initialize page from URL
      shop: searchParams.get("shop") || null,
    };
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      fromPrice: Number(searchParams.get("fromPrice")) || null,
      toPrice: Number(searchParams.get("toPrice")) || null,
      sortBy: (searchParams.get("sortBy") as SortBy) || null,
      rating: searchParams.get("rating")?.split(",").map(Number) || [],
      page: Number(searchParams.get("page")) || 1, // Update page from URL
      shop: searchParams.get("shop") || null,
    });
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (filters.fromPrice !== null) {
      searchParams.set("fromPrice", String(filters.fromPrice));
    }
    if (filters.toPrice !== null) {
      searchParams.set("toPrice", String(filters.toPrice));
    }
    if (filters.sortBy !== null) {
      searchParams.set("sortBy", filters.sortBy);
    }
    if (filters.rating.length > 0) {
      searchParams.set("rating", filters.rating.join(","));
    }
    if (filters.shop !== null) {
      searchParams.set("shop", filters.shop!);
    }
    searchParams.set("page", String(filters.page)); // Reflect page changes in URL

    window.history.replaceState(null, "", `?${searchParams.toString()}`);
  }, [filters]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prevFilters) => {
      const updatedPage = "page" in newFilters ? newFilters.page! : 1;
      return {
        ...prevFilters,
        ...newFilters,
        page: updatedPage,
        rating: newFilters.rating
          ? prevFilters.rating.includes(newFilters.rating[0])
            ? prevFilters.rating.filter((r) => r !== newFilters.rating![0])
            : [...prevFilters.rating, newFilters.rating[0]]
          : prevFilters.rating,
      };
    });
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
// import { createContext, ReactNode, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
//
// type SortBy = "newest" | "best-selling" | "price-asc" | "price-desc" | "random";
//
// interface Filters {
//   fromPrice: number | null;
//   toPrice: number | null;
//   sortBy: SortBy | null;
//   rating: number[];
// }
//
// interface FilterContextType {
//   filters: Filters;
//   updateFilters: (newFilters: Partial<Filters>) => void;
// }
//
// export const FilterContext = createContext<FilterContextType>({
//   filters: {
//     fromPrice: null,
//     toPrice: null,
//     sortBy: null,
//     rating: [],
//   },
//   updateFilters: () => {},
// });
//
// interface FilterProviderProps {
//   children: ReactNode;
// }
//
// export const FilterProvider = ({ children }: FilterProviderProps) => {
//   const location = useLocation();
//   const [filters, setFilters] = useState<Filters>(() => {
//     const searchParams = new URLSearchParams(location.search);
//     return {
//       fromPrice: Number(searchParams.get("fromPrice")) || null,
//       toPrice: Number(searchParams.get("toPrice")) || null,
//       sortBy:
//         (searchParams.get("sortBy") as
//           | "newest"
//           | "best-selling"
//           | "price-asc"
//           | "price-desc"
//           | "random") || null,
//       rating: searchParams.get("rating")?.split(",").map(Number) || [],
//     };
//   });
//
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     setFilters({
//       fromPrice: Number(searchParams.get("fromPrice")) || null,
//       toPrice: Number(searchParams.get("toPrice")) || null,
//       sortBy:
//         (searchParams.get("sortBy") as
//           | "newest"
//           | "best-selling"
//           | "price-asc"
//           | "price-desc"
//           | "random") || null,
//       rating: searchParams.get("rating")?.split(",").map(Number) || [],
//     });
//   }, [location.search]);
//
//   useEffect(() => {
//     const searchParams = new URLSearchParams();
//     if (filters.fromPrice !== null) {
//       searchParams.set("fromPrice", String(filters.fromPrice));
//     }
//     if (filters.toPrice !== null) {
//       searchParams.set("toPrice", String(filters.toPrice));
//     }
//     if (filters.sortBy !== null) {
//       searchParams.set("sortBy", filters.sortBy);
//     }
//     if (filters.rating.length > 0) {
//       searchParams.set("rating", filters.rating.join(","));
//     }
//     window.history.replaceState(null, "", `?${searchParams.toString()}`);
//   }, [filters]);
//
//   const updateFilters = (newFilters: Partial<Filters>) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       ...newFilters,
//       rating: newFilters.rating
//         ? prevFilters.rating.includes(newFilters.rating[0])
//           ? prevFilters.rating.filter((r) => r !== newFilters.rating![0])
//           : [...prevFilters.rating, newFilters.rating[0]]
//         : prevFilters.rating,
//     }));
//   };
//
//   return (
//     <FilterContext.Provider value={{ filters, updateFilters }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };
