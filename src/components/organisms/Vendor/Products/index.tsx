import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  useGetPageProductByStatusQuery,
  useRestoreProductMutation,
  useUpdateProductStatusMutation,
} from "@/redux/features/vendor/product/productShopApiSlice";
import { ProductDTO } from "@/utils/DTOs/vendor/product/Response/ProductResponse";
import { Edit, Eye, EyeOff, Percent, Plus, RotateCcw } from "lucide-react";

const Products = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED"
  >("ACTIVE");
  const size = 25;
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const [isBulkDiscountOpen, setIsBulkDiscountOpen] = useState(false);
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
    },
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
    newStatus: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED",
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
      toast.success("Thay đổi trạng thái thành công");
      refetch();
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  const renderStatusUpdateButton = (product: ProductDTO) => {
    if (product.status === "DELETED") {
      return (
        <button
          onClick={() => handleUpdateStatus(product.productId, "ACTIVE")}
          className="ml-2 py-2 px-3 text-sm font-semibold rounded-full border border-transparent bg-green-600 text-white hover:bg-green-700"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
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
    const endPage = Math.min(totalPage, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
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
      (product) => product.productId === selectedProductId,
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
        <Plus className="w-6 h-6" />
        Thêm sản phẩm mới
      </button>
      <button
        onClick={() => setIsBulkDiscountOpen(true)}
        type="button"
        className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-full border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
      >
        <Percent className="w-6 h-6" />
        Điều chỉnh giá đồng loạt
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
                | "LOCKED",
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
              {/* <td className="border px-4 py-2">{product.status}</td> */}
              <td className="border px-4 py-2">
                {renderStatusUpdateButton(product)}
              </td>
              <td className="flex border px-4 py-2">
                <button
                  onClick={() => {
                    if (product.status !== "LOCKED") {
                      setSelectedProductId(
                        selectedProductId === product.productId
                          ? null
                          : product.productId,
                      );
                    } else {
                      toast.error(
                        "Sản phẩm đã bị khóa, không thể xem chi tiết",
                      );
                    }
                  }}
                  className="py-2 px-3 text-sm font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  {/* {selectedProductId === product.productId */}
                  {/*   ? "Ẩn chi tiết" */}
                  {/*   : "Xem chi tiết"} */}
                  {selectedProductId === product.productId ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Ẩn chi tiết
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Xem chi tiết
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (product.status !== "LOCKED") {
                      navigate(`/vendor/product/edit/${product.productId}`);
                    } else {
                      toast.error("Sản phẩm đã bị khóa, không thể chỉnh sửa");
                    }
                  }}
                  type="button"
                  className="ml-2 py-2 px-3 text-sm font-semibold rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Chỉnh sửa
                </button>
                {/* {renderStatusUpdateButton(product)} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderProductDetails()}

      <div className="text-center mt-4">{renderPageButtons()}</div>

      <BulkPriceAdjustmentDialog
        isOpen={isBulkDiscountOpen}
        onClose={() => setIsBulkDiscountOpen(false)}
      />
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Products;

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  useUpdatePriceByProductIdsMutation,
  useUpdatePercentPriceByProductIdsMutation,
} from "@/redux/features/vendor/product/productShopApiSlice";

const BulkPriceAdjustmentDialog = ({ isOpen, onClose }) => {
  const [selectedProductIds, setSelectedProductIds] = useState({});
  const [page, setPage] = useState(1);
  const [errorProductName, setErrorProductName] = useState(null);
  const size = 10;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      adjustmentType: "percent",
      adjustmentValue: "",
    },
  });

  const adjustmentType = watch("adjustmentType");

  const [updatePriceByProductIds] = useUpdatePriceByProductIdsMutation();
  const [updatePercentPriceByProductIds] =
    useUpdatePercentPriceByProductIdsMutation();

  const { data: productPageResponse, isLoading } =
    useGetPageProductByStatusQuery(
      { page, size, status: "ACTIVE" },
      { refetchOnMountOrArgChange: true },
    );

  const products = productPageResponse?.productDTOs || [];
  const totalPages = productPageResponse?.totalPage || 1;

  const totalProducts = useMemo(
    () => productPageResponse?.totalElements || 0,
    [productPageResponse],
  );

  const selectedCount = useMemo(
    () => Object.values(selectedProductIds).flat().length,
    [selectedProductIds],
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedProductIds({});
      setPage(1);
      setErrorProductName(null);
    }
  }, [isOpen]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProductIds((prevSelected) => ({
        ...prevSelected,
        [page]: products.map((product) => product.productId),
      }));
    } else {
      setSelectedProductIds((prevSelected) => {
        const newSelected = { ...prevSelected };
        delete newSelected[page];
        return newSelected;
      });
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductIds((prevSelected) => {
      const pageSelected = prevSelected[page] || [];
      if (pageSelected.includes(productId)) {
        return {
          ...prevSelected,
          [page]: pageSelected.filter((id) => id !== productId),
        };
      } else {
        return {
          ...prevSelected,
          [page]: [...pageSelected, productId],
        };
      }
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // const extractProductName = (errorMessage) => {
  //   const match = errorMessage.match(/sản phẩm (.*?) có mã/);
  //   return match ? match[1] : null;
  // };
  const extractProductName = (errorMessage) => {
    const match = errorMessage.match(/sản phẩm (.*?) có mã/);
    return match ? match[1].trim() : null;
  };
  const onSubmit = async (data) => {
    const allSelectedIds = Object.values(selectedProductIds).flat();
    const request = {
      productIds: allSelectedIds,
      [data.adjustmentType === "percent" ? "percent" : "price"]: parseInt(
        data.adjustmentValue,
        10,
      ),
    };

    try {
      if (data.adjustmentType === "percent") {
        await updatePercentPriceByProductIds(request).unwrap();
      } else {
        await updatePriceByProductIds(request).unwrap();
      }
      toast.success("Điều chỉnh giá thành công!");
      onClose();
    } catch (error) {
      const errorMessage =
        error.data?.message || "Có lỗi xảy ra khi điều chỉnh giá";
      toast.error(errorMessage);
      const productName = extractProductName(errorMessage);
      setErrorProductName(productName);
    }
  };

  const isAllSelected = useMemo(() => {
    const pageSelected = selectedProductIds[page] || [];
    return pageSelected.length === products.length && products.length > 0;
  }, [selectedProductIds, page, products]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Điều chỉnh giá đồng loạt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Controller
              name="adjustmentType"
              control={control}
              rules={{ required: "Vui lòng chọn loại điều chỉnh giá" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[240px]">
                    {" "}
                    {/* Đã thay đổi từ w-[180px] thành w-[240px] */}
                    <SelectValue placeholder="Chọn loại điều chỉnh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">
                      Điều chỉnh theo phần trăm
                    </SelectItem>
                    <SelectItem value="price">Điều chỉnh theo giá</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="adjustmentValue"
              control={control}
              rules={{
                required: "Vui lòng nhập giá trị điều chỉnh",
                validate: (value) => {
                  const numValue = parseInt(value, 10);
                  if (isNaN(numValue)) return "Giá trị phải là số nguyên";
                  if (
                    adjustmentType === "percent" &&
                    (numValue <= 4 || numValue > 100)
                  ) {
                    return "Phần trăm điều chỉnh phải từ 5 đến 100";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder={
                    adjustmentType === "percent"
                      ? "Nhập % điều chỉnh (5 đến 100)"
                      : "Nhập số tiền điều chỉnh"
                  }
                  className="border p-2 rounded flex-grow"
                />
              )}
            />
          </div>
          {errors.adjustmentValue && (
            <p className="text-red-500">{errors.adjustmentValue.message}</p>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="selectAll"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Chọn tất cả trên trang này
            </label>
            <span className="ml-auto text-sm text-gray-500">
              Đã chọn {selectedCount}/{totalProducts} sản phẩm
            </span>
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className={`flex items-center space-x-2 ${
                    errorProductName && product.name.trim() === errorProductName
                      ? "bg-red-100"
                      : ""
                  }`}
                >
                  <Checkbox
                    checked={(selectedProductIds[page] || []).includes(
                      product.productId,
                    )}
                    onCheckedChange={() =>
                      handleSelectProduct(product.productId)
                    }
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover"
                  />
                  <span>{product.productId}</span>
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  type="button"
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ),
            )}
          </div>
        </form>
        <DialogFooter>
          <Button onClick={onClose} type="button" variant="outline">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={selectedCount === 0}
          >
            Thực hiện
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// import React, { useMemo } from "react";
// import { Loader2 } from "lucide-react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   useUpdatePriceByProductIdsMutation,
//   useUpdatePercentPriceByProductIdsMutation,
// } from "@/redux/features/vendor/product/productShopApiSlice";
//
// const BulkDiscountDialog = ({ isOpen, onClose }) => {
//   const [selectedProductIds, setSelectedProductIds] = useState({});
//   const [page, setPage] = useState(1);
//   const size = 10;
//
//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       discountType: "percent",
//       discountValue: "",
//     },
//   });
//
//   const discountType = watch("discountType");
//
//   const [updatePriceByProductIds] = useUpdatePriceByProductIdsMutation();
//   const [updatePercentPriceByProductIds] =
//     useUpdatePercentPriceByProductIdsMutation();
//
//   const { data: productPageResponse, isLoading } =
//     useGetPageProductByStatusQuery(
//       { page, size, status: "ACTIVE" },
//       { refetchOnMountOrArgChange: true },
//     );
//
//   const products = productPageResponse?.productDTOs || [];
//   const totalPages = productPageResponse?.totalPage || 1;
//
//   const totalProducts = useMemo(
//     () => productPageResponse?.totalElements || 0,
//     [productPageResponse],
//   );
//
//   const selectedCount = useMemo(
//     () => Object.values(selectedProductIds).flat().length,
//     [selectedProductIds],
//   );
//
//   useEffect(() => {
//     if (isOpen) {
//       setSelectedProductIds({});
//       setPage(1);
//     }
//   }, [isOpen]);
//
//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedProductIds((prevSelected) => ({
//         ...prevSelected,
//         [page]: products.map((product) => product.productId),
//       }));
//     } else {
//       setSelectedProductIds((prevSelected) => {
//         const newSelected = { ...prevSelected };
//         delete newSelected[page];
//         return newSelected;
//       });
//     }
//   };
//
//   const handleSelectProduct = (productId) => {
//     setSelectedProductIds((prevSelected) => {
//       const pageSelected = prevSelected[page] || [];
//       if (pageSelected.includes(productId)) {
//         return {
//           ...prevSelected,
//           [page]: pageSelected.filter((id) => id !== productId),
//         };
//       } else {
//         return {
//           ...prevSelected,
//           [page]: [...pageSelected, productId],
//         };
//       }
//     });
//   };
//
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };
//
//   const onSubmit = async (data) => {
//     const allSelectedIds = Object.values(selectedProductIds).flat();
//     const request = {
//       productIds: allSelectedIds,
//       [data.discountType === "percent" ? "percent" : "price"]: parseInt(
//         data.discountValue,
//         10,
//       ),
//     };
//
//     try {
//       if (data.discountType === "percent") {
//         await updatePercentPriceByProductIds(request).unwrap();
//       } else {
//         await updatePriceByProductIds(request).unwrap();
//       }
//       toast.success("Giảm giá thành công!");
//       onClose();
//     } catch (error) {
//       toast.error(error.data.message);
//     }
//   };
//
//   const isAllSelected = useMemo(() => {
//     const pageSelected = selectedProductIds[page] || [];
//     return pageSelected.length === products.length && products.length > 0;
//   }, [selectedProductIds, page, products]);
//
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Giảm giá đồng loạt</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="flex items-center space-x-4">
//             <Controller
//               name="discountType"
//               control={control}
//               rules={{ required: "Vui lòng chọn loại giảm giá" }}
//               render={({ field }) => (
//                 <Select onValueChange={field.onChange} value={field.value}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Chọn loại giảm giá" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="percent">Giảm theo phần trăm</SelectItem>
//                     <SelectItem value="price">Giảm theo giá</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//             <Controller
//               name="discountValue"
//               control={control}
//               rules={{
//                 required: "Vui lòng nhập giá trị giảm giá",
//                 validate: (value) => {
//                   const numValue = parseInt(value, 10);
//                   if (isNaN(numValue)) return "Giá trị phải là số nguyên";
//                   if (
//                     discountType === "percent" &&
//                     (numValue < 0 || numValue > 100)
//                   ) {
//                     return "Phần trăm giảm giá phải từ 0 đến 100";
//                   }
//                   if (numValue < 0) return "Giá trị giảm giá không được âm";
//                   return true;
//                 },
//               }}
//               render={({ field }) => (
//                 <input
//                   {...field}
//                   type="number"
//                   placeholder={
//                     discountType === "percent"
//                       ? "Nhập % giảm giá (0-100)"
//                       : "Nhập số tiền giảm"
//                   }
//                   className="border p-2 rounded"
//                 />
//               )}
//             />
//           </div>
//           {errors.discountValue && (
//             <p className="text-red-500">{errors.discountValue.message}</p>
//           )}
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="selectAll"
//               checked={isAllSelected}
//               onCheckedChange={handleSelectAll}
//             />
//             <label
//               htmlFor="selectAll"
//               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//             >
//               Chọn tất cả trên trang này
//             </label>
//             <span className="ml-auto text-sm text-gray-500">
//               Đã chọn {selectedCount}/{totalProducts} sản phẩm
//             </span>
//           </div>
//           {isLoading ? (
//             <div className="flex justify-center">
//               <Loader2 className="h-6 w-6 animate-spin" />
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {products.map((product) => (
//                 <div
//                   key={product.productId}
//                   className="flex items-center space-x-2"
//                 >
//                   <Checkbox
//                     checked={(selectedProductIds[page] || []).includes(
//                       product.productId,
//                     )}
//                     onCheckedChange={() =>
//                       handleSelectProduct(product.productId)
//                     }
//                   />
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-10 h-10 object-cover"
//                   />
//                   <span>{product.productId}</span>
//                   <span>{product.name}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//           <div className="flex justify-center space-x-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//               (pageNum) => (
//                 <Button
//                   key={pageNum}
//                   type="button"
//                   variant={pageNum === page ? "default" : "outline"}
//                   onClick={() => handlePageChange(pageNum)}
//                 >
//                   {pageNum}
//                 </Button>
//               ),
//             )}
//           </div>
//         </form>
//         <DialogFooter>
//           <Button onClick={onClose} type="button" variant="outline">
//             Hủy
//           </Button>
//           <Button
//             onClick={handleSubmit(onSubmit)}
//             type="submit"
//             disabled={selectedCount === 0}
//           >
//             Thực hiện
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// import React, { useMemo } from "react";
// import { Loader2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
//
// const BulkDiscountDialog = ({ isOpen, onClose }) => {
//   const [selectedProductIds, setSelectedProductIds] = useState({});
//   const [page, setPage] = useState(1);
//   const [discountType, setDiscountType] = useState("percent");
//   const [discountValue, setDiscountValue] = useState("");
//   const size = 10;
//
//   const { data: productPageResponse, isLoading } =
//     useGetPageProductByStatusQuery(
//       { page, size, status: "ACTIVE" },
//       { refetchOnMountOrArgChange: true },
//     );
//
//   const products = productPageResponse?.productDTOs || [];
//   const totalPages = productPageResponse?.totalPage || 1;
//
//   const totalProducts = useMemo(
//     () => productPageResponse?.totalElements || 0,
//     [productPageResponse],
//   );
//
//   const selectedCount = useMemo(
//     () => Object.values(selectedProductIds).flat().length,
//     [selectedProductIds],
//   );
//
//   useEffect(() => {
//     if (isOpen) {
//       setSelectedProductIds({});
//       setPage(1);
//       setDiscountType("percent");
//       setDiscountValue("");
//     }
//   }, [isOpen]);
//
//   const handleSelectAll = (checked) => {
//     if (checked) {
//       setSelectedProductIds((prevSelected) => ({
//         ...prevSelected,
//         [page]: products.map((product) => product.productId),
//       }));
//     } else {
//       setSelectedProductIds((prevSelected) => {
//         const newSelected = { ...prevSelected };
//         delete newSelected[page];
//         return newSelected;
//       });
//     }
//   };
//
//   const handleSelectProduct = (productId) => {
//     setSelectedProductIds((prevSelected) => {
//       const pageSelected = prevSelected[page] || [];
//       if (pageSelected.includes(productId)) {
//         return {
//           ...prevSelected,
//           [page]: pageSelected.filter((id) => id !== productId),
//         };
//       } else {
//         return {
//           ...prevSelected,
//           [page]: [...pageSelected, productId],
//         };
//       }
//     });
//   };
//
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };
//
//   const handleApplyDiscount = () => {
//     const allSelectedIds = Object.values(selectedProductIds).flat();
//     const request =
//       discountType === "percent"
//         ? {
//             productIds: allSelectedIds,
//             percent: parseInt(discountValue, 10),
//           }
//         : {
//             productIds: allSelectedIds,
//             price: parseInt(discountValue, 10),
//           };
//
//     console.log(
//       discountType === "percent"
//         ? "ChangePriceProductsByPercentRequest"
//         : "ChangePriceProductsRequest",
//       request,
//     );
//     onClose();
//   };
//
//   const isAllSelected = useMemo(() => {
//     const pageSelected = selectedProductIds[page] || [];
//     return pageSelected.length === products.length && products.length > 0;
//   }, [selectedProductIds, page, products]);
//
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Giảm giá đồng loạt</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="flex items-center space-x-4">
//             <Select value={discountType} onValueChange={setDiscountType}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Chọn loại giảm giá" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="percent">Giảm theo phần trăm</SelectItem>
//                 <SelectItem value="price">Giảm theo giá</SelectItem>
//               </SelectContent>
//             </Select>
//             <input
//               type="number"
//               value={discountValue}
//               onChange={(e) => setDiscountValue(e.target.value)}
//               placeholder={
//                 discountType === "percent"
//                   ? "Nhập % giảm giá"
//                   : "Nhập số tiền giảm"
//               }
//               className="border p-2 rounded"
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="selectAll"
//               checked={isAllSelected}
//               onCheckedChange={handleSelectAll}
//             />
//             <label
//               htmlFor="selectAll"
//               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//             >
//               Chọn tất cả trên trang này
//             </label>
//             <span className="ml-auto text-sm text-gray-500">
//               Đã chọn {selectedCount}/{totalProducts} sản phẩm
//             </span>
//           </div>
//           {isLoading ? (
//             <div className="flex justify-center">
//               <Loader2 className="h-6 w-6 animate-spin" />
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {products.map((product) => (
//                 <div
//                   key={product.productId}
//                   className="flex items-center space-x-2"
//                 >
//                   <Checkbox
//                     checked={(selectedProductIds[page] || []).includes(
//                       product.productId,
//                     )}
//                     onCheckedChange={() =>
//                       handleSelectProduct(product.productId)
//                     }
//                   />
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-10 h-10 object-cover"
//                   />
//                   <span>{product.productId}</span>
//                   <span>{product.name}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//           <div className="flex justify-center space-x-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//               (pageNum) => (
//                 <Button
//                   key={pageNum}
//                   variant={pageNum === page ? "default" : "outline"}
//                   onClick={() => handlePageChange(pageNum)}
//                 >
//                   {pageNum}
//                 </Button>
//               ),
//             )}
//           </div>
//         </div>
//         <DialogFooter>
//           <Button onClick={onClose} variant="outline">
//             Hủy
//           </Button>
//           <Button onClick={handleApplyDiscount} disabled={selectedCount === 0}>
//             Thực hiện
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
