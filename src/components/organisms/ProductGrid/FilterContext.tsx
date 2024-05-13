import { createContext, ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type SortBy = "newest" | "best-selling" | "price-asc" | "price-desc" | "random";

interface Filters {
  fromPrice: number | null;
  toPrice: number | null;
  sortBy: SortBy | null;
  rating: number[];
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
      sortBy:
        (searchParams.get("sortBy") as
          | "newest"
          | "best-selling"
          | "price-asc"
          | "price-desc"
          | "random") || null,
      rating: searchParams.get("rating")?.split(",").map(Number) || [],
    };
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      fromPrice: Number(searchParams.get("fromPrice")) || null,
      toPrice: Number(searchParams.get("toPrice")) || null,
      sortBy:
        (searchParams.get("sortBy") as
          | "newest"
          | "best-selling"
          | "price-asc"
          | "price-desc"
          | "random") || null,
      rating: searchParams.get("rating")?.split(",").map(Number) || [],
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
    window.history.replaceState(null, "", `?${searchParams.toString()}`);
  }, [filters]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      rating: newFilters.rating
        ? prevFilters.rating.includes(newFilters.rating[0])
          ? prevFilters.rating.filter((r) => r !== newFilters.rating![0])
          : [...prevFilters.rating, newFilters.rating[0]]
        : prevFilters.rating,
    }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// import { createContext, useState, ReactNode, useEffect } from "react";
// import { useLocation } from "react-router-dom";

// interface Filters {
//   rating: number[];
//   minPrice: number | null;
//   maxPrice: number | null;
//   location: string | null;
// }

// interface FilterContextType {
//   filters: Filters;
//   updateFilters: (newFilters: Partial<Filters>) => void;
// }

// export const FilterContext = createContext<FilterContextType>({
//   filters: {
//     rating: [],
//     minPrice: null,
//     maxPrice: null,
//     location: null,
//   },
//   updateFilters: () => {},
// });

// interface FilterProviderProps {
//   children: ReactNode;
// }

// export const FilterProvider = ({ children }: FilterProviderProps) => {
//   const location = useLocation();

//   const [filters, setFilters] = useState<Filters>(() => {
//     const searchParams = new URLSearchParams(location.search);
//     return {
//       rating: searchParams.get("rating")?.split(",").map(Number) || [],
//       minPrice: Number(searchParams.get("minPrice")) || null,
//       maxPrice: Number(searchParams.get("maxPrice")) || null,
//       location: searchParams.get("location") || null,
//     };
//   });

//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     setFilters({
//       rating: searchParams.get("rating")?.split(",").map(Number) || [],
//       minPrice: Number(searchParams.get("minPrice")) || null,
//       maxPrice: Number(searchParams.get("maxPrice")) || null,
//       location: searchParams.get("location") || null,
//     });
//   }, [location.search]);

//   useEffect(() => {
//     const searchParams = new URLSearchParams();

//     if (filters.rating.length > 0) {
//       searchParams.set("rating", filters.rating.join(","));
//     }
//     if (filters.minPrice !== null) {
//       searchParams.set("minPrice", String(filters.minPrice));
//     }
//     if (filters.maxPrice !== null) {
//       searchParams.set("maxPrice", String(filters.maxPrice));
//     }
//     if (filters.location !== null) {
//       searchParams.set("location", filters.location);
//     }

//     window.history.replaceState(null, "", `?${searchParams.toString()}`);
//   }, [filters]);

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

//   return (
//     <FilterContext.Provider value={{ filters, updateFilters }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };
