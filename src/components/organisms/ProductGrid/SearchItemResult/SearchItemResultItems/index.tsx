import { ProductDTO } from "@/utils/DTOs/common/Product/Response/ListProductPageResponse";
import { CardItem } from "./CardItem";

export const SearchItemResultItems = ({
  products,
}: {
  products: ProductDTO[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.length > 0 ? (
        products.map((product) => (
          <CardItem key={product.productId} product={product} />
        ))
      ) : (
        <div>Không có sản phẩm nào</div>
      )}
    </div>
  );
};

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
