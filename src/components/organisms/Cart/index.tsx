import { useState, useEffect } from "react";
import { ShopSection } from "./ShopSection";

interface CartProps {
  data: any;
  isLoading: boolean;
  refetch: () => void;
  handleCreateOrder: (cartIds: string[]) => void;
}

export const Cart = ({
  data,
  isLoading,
  refetch,
  handleCreateOrder,
}: CartProps) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSelectedProducts, setTotalSelectedProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const calculateTotals = () => {
      let totalPrice = 0;
      let totalSelectedProducts = 0;

      data.listCartByShopDTOs.forEach((shopData: any) => {
        shopData.carts.forEach((cart: any) => {
          if (selectedProducts.includes(cart.cartId)) {
            totalPrice += cart.productVariantDTO.price * cart.quantity;
            totalSelectedProducts++;
          }
        });
      });

      setTotalPrice(totalPrice);
      setTotalSelectedProducts(totalSelectedProducts);
    };

    calculateTotals();
  }, [data, selectedProducts]);

  return (
    <>
      <div className="flex bg-gray-100 h-full w-full py-8 mt-44">
        <div className="container mx-full px-16">
          <h1 className="ext-2xl font-semibold mb-4">Shopping Cart</h1>
          <div className="flex flex-col gap-4">
            {data
              ? data.listCartByShopDTOs.map((item: any) => (
                  <ShopSection
                    key={item.shopId}
                    data={item}
                    refetchData={refetch}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                  />
                ))
              : null}
          </div>
          <div
            id="footer-cart"
            className="sticky bottom-0 left-0 w-full bg-white rounded-lg shadow-md p-6 border-2 border-blue-500"
          >
            <div className="flex gap-4 w-full justify-start">
              <div className="flex flex-col justify-start w-full">
                <div className="flex justify-between mb-2">
                  <span>Tổng tiền hàng</span>
                  <span>{totalPrice.toFixed(2)} VNĐ</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mb-2">
                  <span>
                    Tổng thanh toán ({totalSelectedProducts} sản phẩm):
                  </span>
                  <span className="font-semibold">
                    {totalPrice.toFixed(2)} VNĐ
                  </span>
                </div>
              </div>
              <div className="flex w-full justify-end pt-14">
                <button
                  className="w-[200px] h-[50px] bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
                  onClick={() => handleCreateOrder(selectedProducts)}
                  disabled={isLoading}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// import { ListCartResponse } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
// import { ShopSection } from "./ShopSection";

// interface CartProps {
//   data: ListCartResponse;
//   isLoading: boolean;
//   refetch: () => void;
//   handleCreateOrder: () => void;
// }

// export const Cart = ({
//   data,
//   isLoading,
//   refetch,
//   handleCreateOrder,
// }: CartProps) => {
//   //!BEGIN RENDER------------------------------------------
//   return (
//     <>
//       <div className="flex bg-gray-100 h-full w-full py-8 mt-44">
//         <div className="container mx-full px-16">
//           <h1 className="ext-2xl font-semibold mb-4">Shopping Cart</h1>
//           <div className="flex flex-col gap-4">
//             {data
//               ? data.listCartByShopDTOs.map((item) => (
//                   <ShopSection
//                     key={item.shopId}
//                     data={item}
//                     refetchData={refetch}
//                   />
//                 ))
//               : null}
//           </div>
//           <div
//             id="footer-cart"
//             className="sticky bottom-0 left-0 w-full bg-white rounded-lg shadow-md p-6 border-2 border-blue-500"
//           >
//             <div className="flex gap-4 w-full justify-start">
//               <div className="flex flex-col justify-start w-full">
//                 <div className="flex justify-between mb-2">
//                   <span>Tổng tiền hàng</span>
//                   <span>{totalPrice} VNĐ</span>
//                 </div>

//                 <hr className="my-2" />
//                 <div className="flex justify-between mb-2">
//                   {/* <span>Tổng thanh toán (... sản phẩm):</span> */}
//                   <span>
//                     Tổng thanh toán ({totalSelectedProducts} sản phẩm):
//                   </span>
//                   <span className="font-semibold">
//                     {totalPrice.toFixed(2)} VNĐ
//                   </span>
//                 </div>
//               </div>
//               <div className="flex w-full justify-end pt-14">
//                 <button
//                   className="w-[200px] h-[50px] bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
//                   onClick={handleCreateOrder}
//                   disabled={isLoading} // Disable button khi đang loading
//                 >
//                   Mua hàng
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Modal Loading */}
//       {/* {loading && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//           <ClipLoader
//             color={"#ffffff"}
//             css={{ display: "block", margin: "0 auto", borderColor: "red" }}
//             size={150}
//             loading={loading}
//           />
//         </div>
//       )} */}
//       {/* Modal Thành công */}
//       {/* {success && (
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-green-500 bg-opacity-50">
//           <div className="text-white text-4xl">✔️</div>
//         </div>
//       )} */}
//     </>
//   );
// };
