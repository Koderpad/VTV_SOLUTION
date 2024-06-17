import React, { useState } from "react";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { CardItem } from "./CardItem";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const SearchItemResultItems = ({
  products,
}: {
  products: ProductDTO[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Số lượng sản phẩm trên mỗi trang

  // Tính toán các sản phẩm cần hiển thị
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Tạo các nút điều hướng
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {currentItems.length > 0 ? (
          currentItems.map((product) => (
            <CardItem key={product.productId} product={product} />
          ))
        ) : (
          <div>Không có sản phẩm nào</div>
        )}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={currentPage === 1 ? "text-gray-500" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={currentPage === index + 1}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              className={currentPage === totalPages ? "text-gray-500" : ""}
            />
          </PaginationItem>

          {/* <PaginationNext */}
          {/*   onClick={handleNextPage} */}
          {/*   disabled={currentPage === totalPages} */}
          {/* /> */}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
// import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
// import { CardItem } from "./CardItem";
//
// export const SearchItemResultItems = ({
//   products,
// }: {
//   products: ProductDTO[];
// }) => {
//   return (
//     <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//       {products.length > 0 ? (
//         products.map((product) => (
//           <CardItem key={product.productId} product={product} />
//         ))
//       ) : (
//         <div>Không có sản phẩm nào</div>
//       )}
//     </div>
//   );
// };

// export const SearchItemResultItems = ({
//   products,
// }: {
//   products: ProductDTO;
// }) => {
//   return (
//     <div
//       className="
//   grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
//   "
//     >
//       {products.map((product) => (
//         <CardItem key={product.id} product={product} />
//       ))}
//       :<div>Không có sản phẩm nào</div>
//     </div>
//   );
// };
