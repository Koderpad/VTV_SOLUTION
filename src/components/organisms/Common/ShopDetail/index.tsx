import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
import { getProductPageShopByShopId } from "@/services/common/ProductPageService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AiOutlineDown, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { CardItem } from "@/components/molecules/CardItem";

const ShopDetail = () => {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shopData, setShopData] = useState<ShopDTO | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryShopDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentProducts, setCurrentProducts] = useState<ProductDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [productsPerPage] = useState(8);
  const [allProducts, setAllProducts] = useState<ProductDTO[] | null>(null);
  const categories: CategoryShopDTO[] = useMemo(
    () => categoryData,
    [categoryData]
  );
  const [ortherDataShop, setOrtherDataShop] =
    useState<ShopDetailResponse | null>(null);
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "popular"
  );

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
        shopResponse.shopDTO.shopId
      );
      setCategoryData(categoryResponse.categoryShopDTOs);

      //call api to get all products by categories in the shop
      // const products = await Promise.all(
      //   categoryResponse.categoryShopDTOs.map(async (category) => {
      //     const productData = await getListProductByCategoryShopId(
      //       category.categoryShopId,
      //     );
      //     return productData.categoryShopDTO.productDTOs || [];
      //   }),
      // );
      const products = await getProductPageShopByShopId(
        1,
        200,
        shopResponse.shopDTO.shopId
      );
      setAllProducts(products.productDTOs);

      setCurrentProducts(products.productDTOs);
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
          selectedCategoryProducts.categoryShopDTO.productDTOs || []
        );
      }
      setCurrentPage(1); // Reset to first page
    };

    fetchSelectedCategoryProducts();
  }, [selectedCategory]);

  const checkValidPage = (page: number) => {
    console.log(
      "max page: ",
      Math.ceil(currentProducts.length / productsPerPage)
    );
    return (
      page > 0 && page <= Math.ceil(currentProducts.length / productsPerPage)
    );
  };

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
    // if (!checkValidPage(initialPage)) {
    //   setSearchParams({ page: "1" });
    //   return;
    // }
    setCurrentPage(initialPage);
  }, [searchParams]);

  useEffect(() => {
    // if (!checkValidPage(currentPage)) {
    //   setCurrentPage(1);
    //   return;
    // }
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage]);

  useEffect(() => {
    if (!allProducts) return;

    if (sortBy === "popular") {
      setCurrentProducts(allProducts ?? []);
      setSearchParams({ sortBy: "popular" });
    }
    if (sortBy === "newest") {
      const sortedProducts = allProducts?.sort(
        (a, b) => b.productId - a.productId
      );
      setCurrentProducts(sortedProducts ?? []);
      setSearchParams({ sortBy: "newest" });
    }
    if (sortBy === "sales") {
      const sortedProducts = allProducts?.sort((a, b) => b.sold - a.sold);
      setCurrentProducts(sortedProducts ?? []);
      setSearchParams({ sortBy: "sales" });
    }
    if (sortBy === "priceAsc") {
      const sortedProducts = allProducts?.sort(
        (a, b) => a.minPrice - b.minPrice
      );
      setCurrentProducts(sortedProducts ?? []);
      setSearchParams({ sortBy: "priceAsc" });
    }
    if (sortBy === "priceDesc") {
      const sortedProducts = allProducts?.sort(
        (a, b) => b.minPrice - a.minPrice
      );
      setCurrentProducts(sortedProducts ?? []);
      setSearchParams({ sortBy: "priceDesc" });
    }
  }, [sortBy]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProductsPage = currentProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const handleNextPage = () => {
    if (currentPage < Math.ceil(currentProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-8">
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

        <div className="flex flex-col w-3/4 h-full">
          {/* shopee-sort-bar */}
          <div className="h-full w-full mb-4">
            <div className="flex items-center bg-[#EDEDED] px-5 py-3 h-full">
              <span className="text-gray-500 mr-1">Sắp xếp theo</span>
              <div className="flex flex-grow items-center h-8">
                <section className="flex w-auto h-full ml-2 gap-3">
                  {["popular", "newest", "sales"].map((item) => (
                    <button
                      type="button"
                      className={`px-3 h-full ${
                        sortBy === item ? "bg-blue-600" : "bg-white"
                      }`}
                      onClick={() => setSortBy(item)}
                    >
                      <span className="text-black h-8">
                        {item === "popular"
                          ? "Phổ biến"
                          : item === "newest"
                            ? "Mới nhất"
                            : item === "sales"
                              ? "Bán chạy"
                              : ""}
                      </span>
                    </button>
                  ))}
                </section>
                <section className="h-full">
                  <div className="h-full">
                    <div className="flex flex-col w-auto h-full cursor-pointer px-2 group">
                      <button className="flex flex-grow items-center gap-20 bg-white pl-3 pr-1 h-full">
                        <span className="">Giá</span>
                        <div className="w-2"></div>
                        <div className="mr-1">
                          <AiOutlineDown />
                        </div>
                      </button>
                      <div className="relative">
                        <div className="absolute -top-5 py-8 hidden group-hover:block w-full">
                          <div className="flex gap-2 bg-white shadow-lg w-auto -ml-2 pl-5">
                            <div className="flex flex-col w-full gap-2 py-3">
                              <span
                                className={`hover:text-gray-500 ${sortBy === "priceAsc" ? "text-blue-600" : ""}`}
                                onClick={() => setSortBy("priceAsc")}
                              >
                                Giá từ thấp đến cao
                              </span>
                              <span
                                className={`hover:text-gray-500 ${sortBy === "priceDesc" ? "text-blue-600" : ""}`}
                                onClick={() => setSortBy("priceDesc")}
                              >
                                Giá từ cao đến thấp
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              {/* mini page controller */}
              <div className="flex h-8">
                <div className="flex items-center">
                  <span className="text-red-600">{currentPage}</span>/
                  <span className="text-black">
                    {Math.ceil(currentProducts.length / productsPerPage)}
                  </span>
                </div>
                <button
                  className="bg-white ml-5 px-3 py-3 flex items-center"
                  onClick={() => handlePreviousPage()}
                >
                  <AiOutlineLeft
                    className={currentPage === 1 ? "text-gray-300" : ""}
                  />
                </button>
                <button
                  className="bg-white px-3 py-3 flex items-center border-l border-gray-300"
                  onClick={() => handleNextPage()}
                >
                  <AiOutlineRight
                    className={
                      currentPage ===
                      Math.ceil(currentProducts.length / productsPerPage)
                        ? "text-gray-300"
                        : ""
                    }
                  />
                </button>
              </div>
            </div>
          </div>
          {/* Product List */}
          {currentProducts && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProductsPage.map((product) => (
                  // <div
                  //   key={product.productId}
                  //   className="bg-white shadow-md rounded-lg overflow-hidden"
                  // >
                  //   <img
                  //     src={product.image}
                  //     alt={product.name}
                  //     className="w-full h-48 object-cover"
                  //   />
                  //   <div className="p-4">
                  //     <h3 className="text-lg font-semibold mb-2">
                  //       {product.name}
                  //     </h3>
                  //     <div className="flex justify-between items-baseline mb-2">
                  //       <span className="text-xl font-bold text-red-500">
                  //         {product.minPrice.toLocaleString()} ₫ -{" "}
                  //         {product.maxPrice.toLocaleString()} ₫
                  //       </span>
                  //     </div>
                  //     <div className="flex justify-between items-center">
                  //       <span className="text-sm text-gray-500">
                  //         Đã bán: {product.sold}
                  //       </span>
                  //       <span className="text-sm text-yellow-500">
                  //         {product.rating}
                  //       </span>
                  //     </div>
                  //   </div>
                  // </div>
                  <CardItem key={product.productId} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {currentProducts.length > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={currentPage === 1 ? "text-gray-500" : ""}
                />
              </PaginationItem>
              {Array.from(
                { length: Math.ceil(currentProducts.length / productsPerPage) },
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageClick(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={
                    currentPage ===
                    Math.ceil(currentProducts.length / productsPerPage)
                      ? "text-gray-500"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
