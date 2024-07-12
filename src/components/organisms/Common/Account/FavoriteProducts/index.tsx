import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListFavoriteProductsQuery } from "@/redux/features/common/favorite_product/favoriteProductApiSlice";
import { ProductResponse } from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { fetchProductDetail } from "@/services/common/ProductService";

export const FavoriteProducts = () => {
  const { data, error, isLoading, refetch } = useListFavoriteProductsQuery();
  const [productDetails, setProductDetails] = useState<ProductResponse[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (data && data.favoriteProductDTOs) {
        setIsLoadingDetails(true);
        try {
          const details = await Promise.all(
            data.favoriteProductDTOs.map((product) =>
              fetchProductDetail(product.productId)
            )
          );
          setProductDetails(details);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
        setIsLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [data]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading || isLoadingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Đã xảy ra lỗi khi tải danh sách sản phẩm yêu thích.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm yêu thích</h1>
      {productDetails.length > 0 ? (
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 mt-4 mx-4">
            {productDetails.map((product, index) => (
              <div
                key={data?.favoriteProductDTOs[index].favoriteProductId}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                onClick={() => handleProductClick(product.productDTO.productId)}
              >
                <img
                  src={product.productDTO.image || `/api/placeholder/300/200`}
                  alt={product.productDTO.name}
                  className="w-full h-48 object-fill"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {product.productDTO.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Thêm vào danh sách yêu thích:{" "}
                    {new Date(
                      data?.favoriteProductDTOs[index].createAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Bạn chưa có sản phẩm yêu thích nào.
        </p>
      )}
    </div>
  );
};

// import { useListFavoriteProductsQuery } from "@/redux/features/common/favorite_product/favoriteProductApiSlice";
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const FavoriteProducts = () => {
//   const { data, error, isLoading, refetch } = useListFavoriteProductsQuery();
//   const navigate = useNavigate();

//   useEffect(() => {
//     refetch();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 mt-10">
//         Đã xảy ra lỗi khi tải danh sách sản phẩm yêu thích.
//       </div>
//     );
//   }

//   const handleProductClick = (productId: number) => {
//     navigate(`/product/${productId}`);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Sản phẩm yêu thích</h1>
//       {data && data.favoriteProductDTOs.length > 0 ? (
//         <div className="h-[calc(100vh-200px)] overflow-y-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 mt-4 mx-4">
//             {data.favoriteProductDTOs.map((product) => (
//               <div
//                 key={product.favoriteProductId}
//                 className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
//                 onClick={() => handleProductClick(product.productId)}
//               >
//                 {/* <img
//                   src={`/api/placeholder/300/200`}
//                   alt="Product"
//                   className="w-full h-48 object-cover"
//                 /> */}
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold mb-2">
//                     Sản phẩm {product.productId}
//                   </h2>
//                   <p className="text-sm text-gray-600">
//                     Thêm vào danh sách yêu thích:{" "}
//                     {new Date(product.createAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 mt-10">
//           Bạn chưa có sản phẩm yêu thích nào.
//         </p>
//       )}
//     </div>
//   );
// };
