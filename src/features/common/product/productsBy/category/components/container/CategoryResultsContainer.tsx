import { FilterContext } from "@/components/organisms/Common/ProductGrid/FilterContext";
import { SearchItemResultItems } from "@/components/organisms/Common/ProductGrid/SearchItemResult/SearchItemResultItems";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const CategoryResultsContainer = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { filters } = useContext(FilterContext);
  const { fromPrice, toPrice, sortBy, rating } = filters;

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        let allProducts: ProductDTO[] = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const response = await fetch(
            `http://localhost:8585/api/product/by-category/${categoryId}?page=${currentPage}&size=200`,
          );
          const data = await response.json();

          if (data.status === "OK") {
            allProducts = [...allProducts, ...data.productDTOs];
            totalPages = data.totalPage;
          }

          currentPage++;
        }

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [categoryId]);

  const filteredProducts = () => {
    let filtered = products;

    if (fromPrice !== null && toPrice !== null) {
      filtered = filtered.filter(
        (product) =>
          product.minPrice >= fromPrice && product.maxPrice <= toPrice,
      );
    }

    if (rating.length > 0) {
      filtered = filtered.filter((product) =>
        rating.some((r) => Number(product.rating) >= r),
      );
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.productId - a.productId);
        break;
      case "best-selling":
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      case "price-asc":
        filtered.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case "random":
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }

    return filtered;
  };

  if (!categoryId) {
    return <div>Category not found</div>;
  }

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <SearchItemResultItems products={filteredProducts()} />
      )}
    </>
  );
};

// export const CategoryResultsContainer = () => {
//   const { categoryId } = useParams<{
//     categoryId: string;
//   }>();

//   const { filters } = useContext(FilterContext);
//   const { rating, minPrice, maxPrice, location } = filters;

//   const [products, setProducts] = useState<ProductDTO[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         setLoading(true);
//         let allProducts: ProductDTO[] = [];
//         let currentPage = 1;
//         let totalPages = 1;

//         while (currentPage <= totalPages) {
//           const response = await fetch(
//             `http://localhost:8585/api/product/by-category/${categoryId}?page=${currentPage}&size=2`
//           );
//           const data = await response.json();

//           if (data.status === "OK") {
//             allProducts = [...allProducts, ...data.productDTOs];
//             totalPages = data.totalPage;
//             console.log("Total pages:", totalPages);
//           }

//           currentPage++;
//         }

//         setProducts(allProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllProducts();
//   }, [categoryId]);

//   const filteredProducts = () => {
//     return products;
//   };

//   if (!categoryId) {
//     return <div>Category not found</div>;
//   }

//   return (
//     <>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <SearchItemResultItems products={filteredProducts} />
//       )}
//     </>
//   );
// };
