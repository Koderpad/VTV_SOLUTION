import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CarouselItemProductList from "@/components/organisms/Common/shared/CarouselItemProductList";
import { getRandomProductPageInShop } from "@/services/common/ProductSuggestionService";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ProductPageResponse";

export const SimilarProductsCarouselContainer = () => {
  const [products, setProducts] = useState<ProductDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { productId } = useParams<{ productId: string }>();

  const fetchSimilarProducts = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const parsedProductId = parseInt(productId, 10);
      if (isNaN(parsedProductId)) {
        throw new Error("ID sản phẩm không hợp lệ");
      }
      const response = await getRandomProductPageInShop(
        parsedProductId,
        1,
        200,
        true
      );
      setProducts(response.productDTOs);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm tương tự: ", error);
      setProducts(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchSimilarProducts();
  }, [fetchSimilarProducts]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!products || products.length === 0) {
    return <div>Không tìm thấy sản phẩm tương tự.</div>;
  }

  return <CarouselItemProductList products={products} />;
};
