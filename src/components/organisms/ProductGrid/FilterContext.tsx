import { createContext, useState, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Filters {
  rating: number[];
  minPrice: number | null;
  maxPrice: number | null;
  location: string | null;
}

interface FilterContextType {
  filters: Filters;
  updateFilters: (newFilters: Partial<Filters>) => void;
}

export const FilterContext = createContext<FilterContextType>({
  filters: {
    rating: [],
    minPrice: null,
    maxPrice: null,
    location: null,
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
      rating: searchParams.get("rating")?.split(",").map(Number) || [],
      minPrice: Number(searchParams.get("minPrice")) || null,
      maxPrice: Number(searchParams.get("maxPrice")) || null,
      location: searchParams.get("location") || null,
    };
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      rating: searchParams.get("rating")?.split(",").map(Number) || [],
      minPrice: Number(searchParams.get("minPrice")) || null,
      maxPrice: Number(searchParams.get("maxPrice")) || null,
      location: searchParams.get("location") || null,
    });
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (filters.rating.length > 0) {
      searchParams.set("rating", filters.rating.join(","));
    }
    if (filters.minPrice !== null) {
      searchParams.set("minPrice", String(filters.minPrice));
    }
    if (filters.maxPrice !== null) {
      searchParams.set("maxPrice", String(filters.maxPrice));
    }
    if (filters.location !== null) {
      searchParams.set("location", filters.location);
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
//   const searchParams = new URLSearchParams(location.search);

//   const [filters, setFilters] = useState<Filters>({
//     rating: searchParams.get("rating")?.split(",").map(Number) || [],
//     minPrice: Number(searchParams.get("minPrice")) || null,
//     maxPrice: Number(searchParams.get("maxPrice")) || null,
//     location: searchParams.get("location") || null,
//   });

//   console.log(filters);

//   // useEffect(() => {
//   //   const searchParams = new URLSearchParams(location.search);
//   //   setFilters({
//   //     rating: searchParams.get("rating")?.split(",").map(Number) || [],
//   //     minPrice: Number(searchParams.get("minPrice")) || null,
//   //     maxPrice: Number(searchParams.get("maxPrice")) || null,
//   //     location: searchParams.get("location") || null,
//   //   });
//   // }, [location.search]);

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
//     setFilters((prevFilters) => {
//       if (newFilters.rating !== undefined) {
//         const ratingIndex = prevFilters.rating.indexOf(newFilters.rating[0]);
//         if (ratingIndex === -1) {
//           // Rating not found, add it to the array
//           return {
//             ...prevFilters,
//             rating: [...prevFilters.rating, newFilters.rating[0]],
//           };
//         } else {
//           // Rating found, remove it from the array
//           return {
//             ...prevFilters,
//             rating: prevFilters.rating.filter(
//               (_, index) => index !== ratingIndex
//             ),
//           };
//         }
//       }
//       return { ...prevFilters, ...newFilters };
//     });
//   };

//   return (
//     <FilterContext.Provider value={{ filters, updateFilters }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };

// import { createContext, useState, ReactNode } from "react";

// interface Filters {
//   rating: number[];
//   price: number | null;
//   location: string | null;
// }

// interface FilterContextType {
//   filters: Filters;
//   updateFilters: (newFilters: Partial<Filters>) => void;
// }

// export const FilterContext = createContext<FilterContextType>({
//   filters: {
//     rating: [],
//     price: null,
//     location: null,
//   },
//   updateFilters: () => {},
// });

// interface FilterProviderProps {
//   children: ReactNode;
// }

// export const FilterProvider = ({ children }: FilterProviderProps) => {
//   const [filters, setFilters] = useState<Filters>({
//     rating: [],
//     price: null,
//     location: null,
//   });

//   const updateFilters = (newFilters: Partial<Filters>) => {
//     setFilters((prevFilters) => {
//       if (newFilters.rating !== undefined) {
//         const ratingIndex = prevFilters.rating.indexOf(newFilters.rating[0]);
//         if (ratingIndex === -1) {
//           // Rating not found, add it to the array
//           return {
//             ...prevFilters,
//             rating: [...prevFilters.rating, newFilters.rating[0]],
//           };
//         } else {
//           // Rating found, remove it from the array
//           return {
//             ...prevFilters,
//             rating: prevFilters.rating.filter(
//               (_, index) => index !== ratingIndex
//             ),
//           };
//         }
//       }
//       return { ...prevFilters, ...newFilters };
//     });
//   };

//   return (
//     <FilterContext.Provider value={{ filters, updateFilters }}>
//       {children}
//     </FilterContext.Provider>
//   );
// };
