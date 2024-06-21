import { SearchItemResultItems } from "@/components/organisms/ProductGrid/SearchItemResult/SearchItemResultItems";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { FilterContext } from "@/components/organisms/ProductGrid/FilterContext";
import {
  searchProducts,
  searchProductsInShop,
} from "@/services/common/SearchProductService";
export const SearchResultsContainer = () => {
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const { filters, updateFilters } = useContext(FilterContext);
  const { fromPrice, toPrice, sortBy, rating, shop } = filters;

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
          const response = shop
            ? await searchProductsInShop(
                shop,
                currentPage,
                10,
                searchTerm ?? "",
                sortBy ?? "best-selling",
              )
            : await searchProducts(
                currentPage,
                10,
                searchTerm ?? "",
                sortBy ?? "best-selling",
              );
          if (response.status === "OK") {
            allProducts = [...allProducts, ...response.productDTOs];
            totalPages = response.totalPage;
          }

          currentPage++;
        }

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        updateFilters({ sortBy: "best-selling" });
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [searchTerm]);

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

  if (!searchTerm) {
    return <div>searchTerm not found</div>;
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
