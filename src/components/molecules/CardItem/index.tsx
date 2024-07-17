import { Star } from "@/components/atoms/Icon/Star";
import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { useState } from "react";

export const CardItem = ({ product }: { product: ProductDTO }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageList = [
    product.image,
    ...product.productVariantDTOs.map((variant) => variant.image),
  ].filter((image) => image !== "");

  // Hàm định dạng giá với dấu chấm phân cách
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div>
      <div className="group rounded-2xl bg-white p-2">
        <div className="relative h-[400px] overflow-hidden rounded-2xl transition sm:h-[330px]">
          <a
            href={`/product/${product.productId}`}
            className="relative block h-full w-full"
          >
            <img
              src={imageList[activeIndex]}
              alt={`${product.name} IMG${activeIndex + 1}`}
              className="absolute h-full w-full duration-700 opacity-100 object-cover"
              decoding="async"
            />
          </a>
        </div>
        <div className="mb-1 mt-2 space-y-4 px-1">
          <div className="flex gap-2">
            {imageList.map((image, index) => (
              <button
                key={index}
                className="h-[40px] w-[40px] overflow-hidden rounded-full"
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} Thumbnail ${index + 1}`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div>
            <h2 className="text-base font-medium truncate" title={product.name}>
              {product.name}
            </h2>
          </div>
          <div className="flex flex-col items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-black">
                {formatPrice(product.minPrice)} -{" "}
                {formatPrice(product.maxPrice)}đ
              </h3>
            </div>
            <div className="flex items-center justify-center text-xs font-medium text-neutral-500">
              <Star typeStar="filled" />
              <h4>
                {product.rating} (Đã bán: {product.sold})
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import { Star } from "@/components/atoms/Icon/Star";
// import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
// import { useState } from "react";
//
// export const CardItem = ({ product }: { product: ProductDTO }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//
//   // Tạo danh sách các hình ảnh từ ProductDTO và ProductVariantDTO, loại bỏ các hình ảnh rỗng
//   const imageList = [
//     product.image,
//     ...product.productVariantDTOs.map((variant) => variant.image),
//   ].filter((image) => image !== "");
//
//   // Hàm giới hạn độ dài tên sản phẩm
//   const truncateName = (name: string, maxLength: number) => {
//     if (name.length <= maxLength) return name;
//     return name.slice(0, maxLength) + "...";
//   };
//
//   // Hàm định dạng giá với dấu chấm phân cách
//   const formatPrice = (price: number) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };
//
//   return (
//     <div>
//       <div className="group rounded-2xl bg-white p-2">
//         <div className="relative h-[400px] overflow-hidden rounded-2xl transition sm:h-[330px]">
//           <a
//             href={`/product/${product.productId}`}
//             className="relative block h-full w-full"
//           >
//             <img
//               src={imageList[activeIndex]}
//               alt={`${product.name} IMG${activeIndex + 1}`}
//               className="absolute h-full w-full duration-700 opacity-100 object-cover"
//               decoding="async"
//             />
//           </a>
//         </div>
//         <div className="mb-1 mt-2 space-y-4 px-1">
//           <div className="flex gap-2">
//             {imageList.map((image, index) => (
//               <button
//                 key={index}
//                 className="h-[40px] w-[40px] overflow-hidden rounded-full"
//                 onClick={() => setActiveIndex(index)}
//               >
//                 <img
//                   src={image}
//                   alt={`${product.name} Thumbnail ${index + 1}`}
//                   width={40}
//                   height={40}
//                   className="object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//           <div>
//             <h2 className="text-base font-medium">
//               {truncateName(product.name, 35)}
//             </h2>
//           </div>
//           <div className="flex flex-col items-start justify-between gap-4">
//             <div>
//               <h3 className="text-lg font-semibold text-black">
//                 {formatPrice(product.minPrice)} -{" "}
//                 {formatPrice(product.maxPrice)}đ
//               </h3>
//             </div>
//             <div className="flex items-center justify-center text-xs font-medium text-neutral-500">
//               <Star typeStar="filled" />
//               <h4>
//                 {product.rating} (Đã bán: {product.sold})
//               </h4>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
