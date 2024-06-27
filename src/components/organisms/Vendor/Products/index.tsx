import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  useGetPageProductByStatusQuery,
  useRestoreProductMutation,
  useUpdateProductStatusMutation,
} from "@/redux/features/vendor/product/productShopApiSlice";
import { ProductDTO } from "@/utils/DTOs/vendor/product/Response/ProductResponse";

const Products = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED"
  >("ACTIVE");
  const size = 25;
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const navigate = useNavigate();

  const {
    data: productPageResponse,
    isLoading,
    error,
    refetch,
  } = useGetPageProductByStatusQuery(
    { page, size, status },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [restoreProduct] = useRestoreProductMutation();

  useEffect(() => {
    refetch();
  }, [status, page, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error("Error fetching data");
    return <div>Error loading products</div>;
  }

  const products = productPageResponse?.productDTOs || [];

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleStatusChange = (
    newStatus: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED"
  ) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleUpdateStatus = async (productId: number, newStatus: string) => {
    try {
      if (newStatus === "DELETED") {
        await updateProductStatus({ productId, status: newStatus }).unwrap();
      } else {
        const product = products.find((p) => p.productId === productId);
        if (product?.status === "DELETED") {
          await restoreProduct(productId).unwrap();
        } else {
          await updateProductStatus({ productId, status: newStatus }).unwrap();
        }
      }
      toast.success("Product status updated successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to update product status");
    }
  };

  const renderStatusUpdateButton = (product: ProductDTO) => {
    if (product.status === "DELETED") {
      return (
        <button
          onClick={() => handleUpdateStatus(product.productId, "ACTIVE")}
          className="ml-2 py-2 px-3 text-sm font-semibold rounded-full border border-transparent bg-green-600 text-white hover:bg-green-700"
        >
          Khôi phục
        </button>
      );
    }

    return (
      <select
        value={product.status}
        onChange={(e) => handleUpdateStatus(product.productId, e.target.value)}
        className="ml-2 p-2 border rounded text-sm"
        disabled={product.status === "DELETED"}
      >
        <option value="ACTIVE">Hoạt động</option>
        <option value="INACTIVE">Không hoạt động</option>
        <option value="CANCEL">Đã hủy</option>
        <option value="LOCKED">Đã khóa</option>
        <option value="DELETED">Xóa</option>
      </select>
    );
  };

  const renderPageButtons = () => {
    if (!productPageResponse) {
      return null;
    }

    const totalPage = productPageResponse.totalPage;
    const currentPage = page;

    const visiblePages = 5;
    const halfVisiblePages = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPage, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );

    return (
      <div className="flex space-x-2 justify-center">
        {startPage > 1 && (
          <button
            className={`px-3 py-2 bg-gray-200 rounded-md`}
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
        )}
        {startPage > 2 && <span className="px-3 py-2">...</span>}
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-3 py-2 ${
              pageNumber === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            } rounded-md`}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        {endPage < totalPage - 1 && <span className="px-3 py-2">...</span>}
        {endPage < totalPage && (
          <button
            className={`px-3 py-2 bg-gray-200 rounded-md`}
            onClick={() => handlePageClick(totalPage)}
          >
            {totalPage}
          </button>
        )}
      </div>
    );
  };

  const renderProductDetails = () => {
    if (!selectedProductId) {
      return null;
    }

    const selectedProduct = products.find(
      (product) => product.productId === selectedProductId
    );

    if (!selectedProduct) {
      return null;
    }

    const truncateText = (text: string, limit: number) => {
      const words = text.split(" ");
      if (words.length > limit) {
        return words.slice(0, limit).join(" ") + "...";
      }
      return text;
    };

    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
        <div className="bg-white p-4 rounded-md w-full md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-auto">
          <h2 className="text-2xl font-bold mb-2">Chi tiết Sản phẩm</h2>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md mb-4"
            onClick={() => setSelectedProductId(null)}
          >
            Đóng
          </button>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0 md:mr-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <p>
                <span className="font-semibold">ID:</span>{" "}
                {selectedProduct.productId}
              </p>
              <p>
                <span className="font-semibold">Tên:</span>{" "}
                {selectedProduct.name}
              </p>
              <p>
                <span className="font-semibold">Mô tả:</span>{" "}
                {truncateText(selectedProduct.description, 100)}
              </p>
              <p>
                <span className="font-semibold">Thông tin:</span>{" "}
                {truncateText(selectedProduct.information, 100)}
              </p>
              <p>
                <span className="font-semibold">Đã bán:</span>{" "}
                {selectedProduct.sold}
              </p>
              <p>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {selectedProduct.status}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">
            Phiên bản sản phẩm
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {selectedProduct.productVariantDTOs.map((variant) => (
              <div
                key={variant.productVariantId}
                className="border p-2 mb-2 rounded"
              >
                <p>
                  <span className="font-semibold">SKU:</span> {variant.sku}
                </p>
                <p>
                  <span className="font-semibold">Giá:</span> {variant.price}
                </p>
                <p>
                  <span className="font-semibold">Số lượng:</span>{" "}
                  {variant.quantity}
                </p>
                <p>
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  {variant.status}
                </p>

                <h4 className="font-semibold mt-2">Thuộc tính:</h4>
                <div className="ml-4">
                  {variant.attributeDTOs.map((attribute) => (
                    <div key={attribute.attributeId}>
                      <p>
                        <span className="font-semibold">{attribute.name}:</span>{" "}
                        {attribute.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-8">
      <button
        onClick={() => {
          navigate("/vendor/product/new");
        }}
        type="button"
        className="mb-4 py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        Thêm sản phẩm mới
      </button>

      <div className="mb-4">
        <label htmlFor="status-select" className="mr-2">
          Lọc theo trạng thái:
        </label>
        <select
          id="status-select"
          value={status}
          onChange={(e) =>
            handleStatusChange(
              e.target.value as
                | "ACTIVE"
                | "INACTIVE"
                | "DELETED"
                | "CANCEL"
                | "LOCKED"
            )
          }
          className="p-2 border rounded"
        >
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="DELETED">Đã xóa</option>
          <option value="CANCEL">Đã hủy</option>
          <option value="LOCKED">Đã khóa</option>
        </select>
      </div>

      <table className="table-auto w-full border-collapse border border-green-800">
        <thead>
          <tr>
            <th className="px-4 py-2">STT</th>
            <th className="px-4 py-2">Mã sản phẩm</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Hình ảnh</th>
            <th className="px-4 py-2">Số lượng bán</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.productId}
              className={`${
                selectedProductId === product.productId ? "bg-blue-200" : ""
              } hover:bg-blue-100 cursor-pointer`}
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{product.productId}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12"
                />
              </td>
              <td className="border px-4 py-2">{product.sold}</td>
              <td className="border px-4 py-2">{product.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() =>
                    setSelectedProductId(
                      selectedProductId === product.productId
                        ? null
                        : product.productId
                    )
                  }
                  className="py-2 px-3 text-sm font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  {selectedProductId === product.productId
                    ? "Ẩn chi tiết"
                    : "Xem chi tiết"}
                </button>
                <button
                  onClick={() => {
                    navigate(`/vendor/product/edit/${product.productId}`);
                  }}
                  type="button"
                  className="ml-2 py-2 px-3 text-sm font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  Chỉnh sửa
                </button>
                {renderStatusUpdateButton(product)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderProductDetails()}

      <div className="text-center mt-4">{renderPageButtons()}</div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Products;

// import React, { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useGetPageProductByUsernameMutation } from "../../features/vendor/redux/api/addProductApi";
// import { useNavigate } from "react-router-dom";

// const Products = () => {
//   const [page, setPage] = useState(1);
//   const size = 25;
//   const [products, setProducts] = useState([]);
//   const [productPageResponse, setProductPageResponse] =
//     useState<ListProductPageResponse | null>(null);
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   const [getListProductPage, { isLoading }] =
//     useGetPageProductByUsernameMutation();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getListProductPage({ page, size });
//         const responseData = response?.data;

//         if (responseData) {
//           setProductPageResponse(responseData);
//           setProducts(responseData.productDTOs || []);
//           toast.success(responseData.message);
//         } else {
//           toast.error("Invalid response data");
//         }
//       } catch (error) {
//         console.error("Lỗi tìm nạp dữ liệu:", error);
//         toast.error(error.data?.message || "Error fetching data");
//       }
//     };

//     fetchData();
//   }, [getListProductPage, page, size]);

//   const handlePageClick = (pageNumber) => {
//     setPage(pageNumber);
//   };

//   const renderPageButtons = () => {
//     if (!productPageResponse) {
//       return null;
//     }

//     const totalPage = productPageResponse.totalPage;
//     const currentPage = page;

//     const visiblePages = 5; // Number of pages to display around the current page
//     const halfVisiblePages = Math.floor(visiblePages / 2);

//     let startPage = Math.max(1, currentPage - halfVisiblePages);
//     let endPage = Math.min(totalPage, startPage + visiblePages - 1);

//     // Adjust startPage and endPage to always display visiblePages number of buttons
//     if (endPage - startPage + 1 < visiblePages) {
//       startPage = Math.max(1, endPage - visiblePages + 1);
//     }

//     const pages = Array.from(
//       { length: endPage - startPage + 1 },
//       (_, index) => startPage + index
//     );

//     return (
//       <div className="flex space-x-2 justify-center">
//         {startPage > 1 && (
//           <button
//             className={`px-3 py-2 bg-gray-200 rounded-md`}
//             onClick={() => handlePageClick(1)}
//           >
//             1
//           </button>
//         )}
//         {startPage > 2 && <span className="px-3 py-2">...</span>}
//         {pages.map((pageNumber) => (
//           <button
//             key={pageNumber}
//             className={`px-3 py-2 ${
//               pageNumber === currentPage
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200"
//             } rounded-md`}
//             onClick={() => handlePageClick(pageNumber)}
//           >
//             {pageNumber}
//           </button>
//         ))}
//         {endPage < totalPage - 1 && <span className="px-3 py-2">...</span>}
//         {endPage < totalPage && (
//           <button
//             className={`px-3 py-2 bg-gray-200 rounded-md`}
//             onClick={() => handlePageClick(totalPage)}
//           >
//             {totalPage}
//           </button>
//         )}
//       </div>
//     );
//   };

//   const navigate = useNavigate();

//   const handleViewProduct = (e) => {
//     e.preventDefault();
//     navigate(`/product/${e.target.value}`);
//   };

//   const renderProductDetails = () => {
//     if (!selectedProductId) {
//       return null;
//     }

//     const selectedProduct = products.find(
//       (product) => product.productId === selectedProductId
//     );

//     if (!selectedProduct) {
//       return null;
//     }

//     return (
//       <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
//         <div className="bg-white p-4 rounded-md w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4">
//           <h2 className="text-2xl font-bold mb-2">Chi tiết Sản phẩm</h2>
//           <br />
//           <button
//             className="end-right"
//             onClick={handleViewProduct}
//             value={selectedProduct.productId}
//           >
//             Xem Chi Tiết Tại Sàn
//           </button>

//           {/* Product Details - Left Side */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-shrink-0 md:mr-4">
//               <img
//                 src={selectedProduct.image}
//                 alt={selectedProduct.name}
//                 className="w-32 h-32 object-cover rounded-md"
//               />
//             </div>
//             <div className="flex-1 md:mt-0 mt-4">
//               <p className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-500">ID:</span>
//                 <span>{selectedProduct.productId}</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-500">Tên:</span>
//                 <span>{selectedProduct.name}</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-500">Mô tả:</span>
//                 <span>{selectedProduct.description}</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-500">Thông tin:</span>
//                 <span>{selectedProduct.information}</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-500">Đã bán:</span>
//                 <span>{selectedProduct.sold}</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-500">Trạng thái:</span>
//                 <span>{selectedProduct.status}</span>
//               </p>
//             </div>
//           </div>

//           {/* Product Variant and Attribute Details - Right Side */}
//           <div className="flex flex-col gap-4 md:flex-row">
//             {selectedProduct.productVariantDTOs.map((variant, index) => (
//               <div
//                 key={variant.productVariantId}
//                 className={`flex-1 md:mr-4 ${index !== 0 ? "mt-4" : ""}`}
//               >
//                 <h3 className="text-lg font-semibold">
//                   Thông tin phiên bản sản phẩm
//                 </h3>
//                 <p className="flex items-center gap-2">
//                   <span className="font-semibold text-green-500">SKU:</span>
//                   <span>{variant.sku}</span>
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <span className="font-semibold text-green-500">Giá:</span>
//                   <span>{variant.price}</span>
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <span className="font-semibold text-green-500">
//                     Số lượng:
//                   </span>
//                   <span>{variant.quantity}</span>
//                 </p>
//                 <p className="flex items-center gap-2">
//                   <span className="font-semibold text-green-500">
//                     Trạng thái:
//                   </span>
//                   <span>{variant.status}</span>
//                   <br />
//                 </p>
//                 <div className="mt-2">
//                   {variant.attributeDTOs.map((attribute) => (
//                     <div key={attribute.attributeId}>
//                       <h4 className="text-base font-semibold text-black">
//                         {attribute.name}
//                       </h4>
//                       <p className="flex items-center gap-2">
//                         <span className="font-semibold text-black">
//                           Giá trị:
//                         </span>
//                         <span>{attribute.value}</span>
//                       </p>
//                       <p className="flex items-center gap-2">
//                         <span className="font-semibold text-black">
//                           Trạng thái:
//                         </span>
//                         <span>{attribute.active ? "Active" : "Inactive"}</span>
//                       </p>
//                       <br />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             className="bg-blue-500 text-white px-2 py-1 rounded-md self-end mt-4"
//             onClick={() => setSelectedProductId(null)}
//           >
//             Đóng
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       <button
//         onClick={() => {
//           navigate("/vendor/product/new");
//         }}
//         type="button"
//         className="mb-4 py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//       >
//         Thêm sản phẩm mới
//       </button>
//       <table className="table-auto w-full border-collapse border border-green-800">
//         <thead>
//           <tr>
//             <th className="px-4 py-2">STT</th>
//             <th className="px-4 py-2">Mã sản phẩm</th>
//             <th className="px-4 py-2">Tên</th>
//             <th className="px-4 py-2">Hình ảnh</th>
//             <th className="px-4 py-2">Số lượng bán</th>
//             <th className="px-4 py-2">Thao tác</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product, index) => (
//             <tr
//               key={product.productId}
//               className={`${
//                 selectedProductId === product.productId ? "bg-blue-200" : ""
//               } hover:bg-blue-100 cursor-pointer`}
//             >
//               <td className="border px-4 py-2">{index + 1}</td>
//               <td className="border px-4 py-2">{product.productId}</td>
//               <td className="border px-4 py-2">{product.name}</td>
//               <td className="border px-4 py-2">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-12 h-12"
//                 />
//               </td>
//               <td className="border px-4 py-2">{product.sold}</td>
//               <td className="border px-4 py-2">
//                 <button
//                   onClick={() =>
//                     setSelectedProductId(
//                       selectedProductId === product.productId
//                         ? null
//                         : product.productId
//                     )
//                   }
//                   // className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
//                   className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                 >
//                   {selectedProductId === product.productId
//                     ? "Ẩn chi tiết"
//                     : "Xem chi tiết"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     navigate(`/vendor/product/edit/${product.productId}`);
//                   }}
//                   type="button"
//                   className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                 >
//                   Chỉnh sửa
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {renderProductDetails()}

//       <div className="text-center mt-4">{renderPageButtons()}</div>

//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// export default Products;
