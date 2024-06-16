import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  getCategoryListByShopId,
  getListProductByCategoryShopId,
  getShopByUsername,
} from "@/services/common/ShopService";
import { CategoryShopDTO } from "@/utils/DTOs/common/ShopDetail/Response/ListCategoryShopResponse";
import {
  ShopDTO,
  ShopDetailResponse,
} from "@/utils/DTOs/common/ShopDetail/Response/ShopDetailResponse";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";

const ShopDetail = () => {
  const { username } = useParams();
  const [shopData, setShopData] = useState<ShopDTO | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryShopDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentProducts, setCurrentProducts] = useState<ProductDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [allProducts, setAllProducts] = useState<ProductDTO[] | null>(null);
  const categories: CategoryShopDTO[] = useMemo(
    () => categoryData,
    [categoryData],
  );
  const [ortherDataShop, setOrtherDataShop] =
    useState<ShopDetailResponse | null>(null);

  const callApisSequentially = async () => {
    console.log("username: ", username);
    if (!username || isLoading) return;
    console.log("into callApisSequentially");
    try {
      setIsLoading(true);
      //call api to get shop data by username
      const shopResponse = await getShopByUsername(String(username));
      setShopData(shopResponse.shopDTO);
      setOrtherDataShop(shopResponse);

      //call api to get category data by shopId
      const categoryResponse = await getCategoryListByShopId(
        shopResponse.shopDTO.shopId,
      );
      setCategoryData(categoryResponse.categoryShopDTOs);

      //call api to get all products by categories in the shop
      const products = await Promise.all(
        categoryResponse.categoryShopDTOs.map(async (category) => {
          const productData = await getListProductByCategoryShopId(
            category.categoryShopId,
          );
          return productData.categoryShopDTO.productDTOs || [];
        }),
      );
      setAllProducts(products.flat());
    } catch (error) {
      alert("Error fetching shop or category data:" + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callApisSequentially();
  }, [username]);

  useEffect(() => {
    const fetchSelectedCategoryProducts = async () => {
      if (selectedCategory === null) {
        setCurrentProducts(allProducts ?? []);
      } else {
        const selectedCategoryProducts =
          await getListProductByCategoryShopId(selectedCategory);
        setCurrentProducts(
          selectedCategoryProducts.categoryShopDTO.productDTOs || [],
        );
      }
      setCurrentPage(1); // Reset to first page
    };

    fetchSelectedCategoryProducts();
  }, [selectedCategory, allProducts]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProductsPage = currentProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Info */}
      <div className="mb-8 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">{shopData?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-500">Địa chỉ</span>
            <p className="text-lg">{shopData?.address}</p>
          </div>
          <div>
            <span className="text-gray-500">Số điện thoại</span>
            <p className="text-lg">{shopData?.phone}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="text-lg">{shopData?.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Giờ mở cửa</span>
            <p className="text-lg">
              {shopData?.openTime} - {shopData?.closeTime}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Số người theo dõi</span>
            <p className="text-lg">{ortherDataShop?.countFollowed}</p>
          </div>
          <div>
            <span className="text-gray-500">Số sản phẩm</span>
            <p className="text-lg">{ortherDataShop?.countProduct}</p>
          </div>
          <div>
            <span className="text-gray-500">Số danh mục</span>
            <p className="text-lg">{ortherDataShop?.countCategoryShop}</p>
          </div>
          <div>
            <span className="text-gray-500">Đánh giá trung bình</span>
            <p className="text-lg">
              {ortherDataShop?.averageRatingShop.toFixed(1)}
            </p>
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
                  onClick={() => handleCategorySelect(null)}
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
                    onClick={() =>
                      handleCategorySelect(category.categoryShopId)
                    }
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product List */}
        {currentProducts && (
          <>
            <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentProductsPage.map((product) => (
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
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
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
          </>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Previous
              </button>
            </li>
            {Array.from(
              { length: Math.ceil(currentProducts.length / productsPerPage) },
              (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 leading-tight ${
                      currentPage === index + 1
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 bg-white"
                    } border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                  >
                    {index + 1}
                  </button>
                </li>
              ),
            )}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(currentProducts.length / productsPerPage)
                }
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ShopDetail;
