import React, { useState, useEffect, useCallback, useRef } from "react";

import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { getFilterProductPage } from "@/services/common/ProductService";
import { CardItem } from "@/components/molecules/CardItem";
const SuggestedProductList = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isInitialMount = useRef(true);

  const loadProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await getFilterProductPage(page, 10, "random");
      const newProducts = response.productDTOs.filter(
        (product) => product.status === "ACTIVE"
      );
      setProducts((prevProducts) => {
        const uniqueNewProducts = newProducts.filter(
          (newProduct) =>
            !prevProducts.some(
              (prevProduct) => prevProduct.productId === newProduct.productId
            )
        );
        const updatedProducts = [...prevProducts, ...uniqueNewProducts];

        setHasMore(
          updatedProducts.length < 100 && uniqueNewProducts.length > 0
        );
        return updatedProducts.slice(0, 100); // Ensure we never exceed 100 products
      });
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadProducts();
    }
  }, [loadProducts]);

  return (
    <div className="suggested-products">
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm gợi ý</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <CardItem key={product.productId} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadProducts}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Đang tải..." : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestedProductList;

// import React, { useState, useEffect, useCallback } from "react";

// import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
// import { getFilterProductPage } from "@/services/common/ProductService";
// import { CardItem } from "@/components/molecules/CardItem";

// const SuggestedProductList = () => {
//   const [products, setProducts] = useState<ProductDTO[]>([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const loadProducts = useCallback(async () => {
//     if (isLoading || !hasMore) return;
//     setIsLoading(true);
//     try {
//       const response = await getFilterProductPage(page, 10, "random");
//       const newProducts = response.productDTOs;
//       setProducts((prevProducts) => {
//         const updatedProducts = [...prevProducts, ...newProducts];
//         setHasMore(updatedProducts.length < 100 && newProducts.length === 10);
//         return updatedProducts.slice(0, 100); // Ensure we never exceed 100 products
//       });
//       setPage((prevPage) => prevPage + 1);
//     } catch (error) {
//       console.error("Error loading products:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [page, isLoading, hasMore]);

//   useEffect(() => {
//     if (products.length === 0) {
//       loadProducts();
//     }
//   }, [loadProducts, products.length]);

//   return (
//     <div className="suggested-products">
//       <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm gợi ý</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//         {products.map((product) => (
//           <CardItem key={product.productId} product={product} />
//         ))}
//       </div>
//       {hasMore && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={loadProducts}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             disabled={isLoading}
//           >
//             {isLoading ? "Đang tải..." : "Xem thêm"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuggestedProductList;

// import React, { useState, useEffect } from "react";

// import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
// import { getFilterProductPage } from "@/services/common/ProductService";
// import { CardItem } from "@/components/molecules/CardItem";

// const SuggestedProductList = () => {
//   const [products, setProducts] = useState<ProductDTO[]>([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const loadProducts = async () => {
//     if (isLoading || !hasMore) return;
//     setIsLoading(true);
//     try {
//       const response = await getFilterProductPage(page, 10, "random");
//       const newProducts = response.productDTOs;
//       setProducts((prevProducts) => [...prevProducts, ...newProducts]);
//       setPage((prevPage) => prevPage + 1);
//       setHasMore(
//         products.length + newProducts.length < 100 && newProducts.length > 0
//       );
//     } catch (error) {
//       console.error("Error loading products:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   return (
//     <div className="suggested-products mt-4">
//       <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm gợi ý</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//         {products.map((product) => (
//           <CardItem key={product.productId} product={product} />
//         ))}
//       </div>
//       {hasMore && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={loadProducts}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//             disabled={isLoading}
//           >
//             {isLoading ? "Đang tải..." : "Xem thêm"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuggestedProductList;
