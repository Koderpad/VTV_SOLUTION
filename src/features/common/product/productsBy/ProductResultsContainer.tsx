import { useLocation } from "react-router-dom";
import { CategoryResultsContainer } from "@/features/common/product/productsBy/category/components/container/CategoryResultsContainer";
import { SearchResultsContainer } from "@/features/common/product/productsBy/search/components/container/SearchResultsContainer";

export const ProductResultsContainer = () => {
  const location = useLocation();

  const isSearchPage = location.pathname.startsWith("/search");

  return isSearchPage ? (
    <SearchResultsContainer />
  ) : (
    <CategoryResultsContainer />
  );
};
