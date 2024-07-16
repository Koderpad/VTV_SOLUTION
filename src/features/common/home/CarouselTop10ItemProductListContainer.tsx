import CarouselItemProductList from "@/components/organisms/Common/shared/CarouselItemProductList";
import { getFilterProductPage } from "@/services/common/ProductService";
import { getRandomProductPage } from "@/services/common/ProductSuggestionService";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ProductPageResponse";
import { useEffect, useState } from "react";

export const CarouselTop10ItemProductListContainer = () => {
  const [products, setProducts] = useState<ProductDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await getFilterProductPage(1, 10, "best-selling");
        const activeProducts = response.productDTOs.filter(
          (product) => product.status === "ACTIVE"
        );
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading || !products) {
    return null;
  }

  return <CarouselItemProductList products={products} />;
};
