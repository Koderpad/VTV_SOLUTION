import {
  useGetCategoryListByShopIdQuery,
  useGetShopByUsernameQuery,
} from "@/redux/features/common/shop/shopApiSlice";
import { CategoryShopDTO } from "@/utils/DTOs/common/ShopDetail/Response/ListCategoryShopResponse";
import { ShopDTO } from "@/utils/DTOs/common/ShopDetail/Response/ShopDetailResponse";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ShopDetail: React.FC = () => {
  const { username } = useParams<{
    username: string;
  }>();
  console.log("username: ", username);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });
  const [sortOption, setSortOption] = useState<string>("default");

  const { data: shopData, isLoading: isShopLoading } =
    useGetShopByUsernameQuery(String(username));
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetCategoryListByShopIdQuery(Number(shopData?.shopDTO?.shopId));
  const shop: ShopDTO | undefined = shopData?.shopDTO;
  const categories: CategoryShopDTO[] = categoryData?.categoryShopDTOs || [];

  const filteredProducts = categories
    .flatMap((category) => category.productDTOs)
    .filter((product) =>
      selectedCategory ? product?.categoryId === selectedCategory : true,
    )
    .filter(
      (product) =>
        product?.minPrice >= priceRange.min &&
        product.maxPrice <= priceRange.max,
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "newest") return b.productId - a.productId;
    if (sortOption === "best-selling") return b.sold - a.sold;
    if (sortOption === "price-asc") return a.minPrice - b.minPrice;
    if (sortOption === "price-desc") return b.minPrice - a.minPrice;
    return Math.random() - 0.5;
  });

  if (isShopLoading || isCategoryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Info */}
      <div className="mb-8 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">{shop?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-500">Địa chỉ</span>
            <p className="text-lg">{shop?.address}</p>
          </div>
          <div>
            <span className="text-gray-500">Số điện thoại</span>
            <p className="text-lg">{shop?.phone}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="text-lg">{shop?.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Giờ mở cửa</span>
            <p className="text-lg">
              {shop?.openTime} - {shop?.closeTime}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Số người theo dõi</span>
            <p className="text-lg">{shopData?.countFollowed}</p>
          </div>
          <div>
            <span className="text-gray-500">Số sản phẩm</span>
            <p className="text-lg">{shopData?.countProduct}</p>
          </div>
          <div>
            <span className="text-gray-500">Số danh mục</span>
            <p className="text-lg">{shopData?.countCategoryShop}</p>
          </div>
          <div>
            <span className="text-gray-500">Đánh giá trung bình</span>
            <p className="text-lg">{shopData?.averageRatingShop.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 pr-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Danh mục sản phẩm</h3>
            <ul>
              <li>
                <button
                  className={`block py-1 ${selectedCategory === null ? "text-blue-500" : "text-gray-700"}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Tất cả
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.categoryShopId}>
                  <button
                    className={`block py-1 ${
                      selectedCategory === category.categoryShopId
                        ? "text-blue-500"
                        : "text-gray-700"
                    }`}
                    onClick={() => setSelectedCategory(category.categoryShopId)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Khoảng giá</h3>
            <div className="flex items-center">
              <input
                type="number"
                className="w-1/2 px-2 py-1 border border-gray-300 rounded mr-2"
                placeholder="Từ"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
              />
              <input
                type="number"
                className="w-1/2 px-2 py-1 border border-gray-300 rounded"
                placeholder="Đến"
                value={priceRange.max !== Infinity ? priceRange.max : ""}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: e.target.value ? Number(e.target.value) : Infinity,
                  })
                }
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sắp xếp theo</h3>
            <select
              className="w-full px-2 py-1 border border-gray-300 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="best-selling">Bán chạy</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="random">Ngẫu nhiên</option>
            </select>
          </div>
        </div>

        {/* Product List */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xl font-bold text-red-500">
                    {product.minPrice.toLocaleString()} ₫ -{" "}
                    {product.maxPrice.toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Đã bán: {product.sold}
                  </span>
                  <span className="text-sm text-yellow-500">
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
