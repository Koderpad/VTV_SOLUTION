import CarouselItemProductList from "@/components/organisms/shared/CarouselItemProductList";
import { getRandomProductPage } from "@/services/common/ProductSuggestionService";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ProductPageResponse";
import { useEffect, useState } from "react";

export const CarouselItemProductListContainer = () => {
  const [products, setProducts] = useState<ProductDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await getRandomProductPage(1, 200);
        setProducts(response.productDTOs);
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
