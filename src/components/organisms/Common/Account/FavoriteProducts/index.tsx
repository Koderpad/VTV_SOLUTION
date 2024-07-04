import { useListFavoriteProductsQuery } from "@/redux/features/common/favorite_product/favoriteProductApiSlice";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const FavoriteProducts = () => {
  const { data, error, isLoading, refetch } = useListFavoriteProductsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
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

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sản phẩm yêu thích</h1>
      {data && data.favoriteProductDTOs.length > 0 ? (
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 mt-4 mx-4">
            {data.favoriteProductDTOs.map((product) => (
              <div
                key={product.favoriteProductId}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                onClick={() => handleProductClick(product.productId)}
              >
                <img
                  src={`/api/placeholder/300/200`}
                  alt="Product"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Sản phẩm {product.productId}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Thêm vào danh sách yêu thích:{" "}
                    {new Date(product.createAt).toLocaleDateString()}
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
