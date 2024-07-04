import { useState, useEffect } from "react";
import { ShopSection } from "./ShopSection";
import { useGetListCartByUsernameQuery } from "@/redux/features/common/cart/cartApiSlice";

interface CartProps {
  handleCreateOrder: (cartIds: string[]) => void;
}

export const Cart = ({ handleCreateOrder }: CartProps) => {
  const { data, isLoading, refetch } = useGetListCartByUsernameQuery();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSelectedProducts, setTotalSelectedProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const calculateTotals = () => {
      let totalPrice = 0;
      let totalSelectedProducts = 0;

      data?.listCartByShopDTOs.forEach((shopData: any) => {
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

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!data || data.listCartByShopDTOs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>
        <div className="space-y-6">
          {data.listCartByShopDTOs.map((item: any) => (
            <ShopSection
              key={item.shopId}
              data={item}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 sticky bottom-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Tổng tiền hàng</span>
            <span className="text-xl font-semibold">
              {totalPrice.toLocaleString()} VNĐ
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg">
              Tổng thanh toán ({totalSelectedProducts} sản phẩm):
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {totalPrice.toLocaleString()} VNĐ
            </span>
          </div>
          <button
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mt-6 hover:bg-blue-600 transition duration-300"
            onClick={() => handleCreateOrder(selectedProducts)}
            disabled={isLoading || selectedProducts.length === 0}
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
};

// import { useState, useEffect } from "react";
// import { ShopSection } from "./ShopSection";

// interface CartProps {
//   data: any;
//   isLoading: boolean;
//   refetch: () => void;
//   handleCreateOrder: (cartIds: string[]) => void;
// }

// export const Cart = ({
//   data,
//   isLoading,
//   handleCreateOrder,
// }: CartProps) => {
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [totalSelectedProducts, setTotalSelectedProducts] = useState(0);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

//   useEffect(() => {
//     const calculateTotals = () => {
//       let totalPrice = 0;
//       let totalSelectedProducts = 0;

//       data.listCartByShopDTOs.forEach((shopData: any) => {
//         shopData.carts.forEach((cart: any) => {
//           if (selectedProducts.includes(cart.cartId)) {
//             totalPrice += cart.productVariantDTO.price * cart.quantity;
//             totalSelectedProducts++;
//           }
//         });
//       });

//       setTotalPrice(totalPrice);
//       setTotalSelectedProducts(totalSelectedProducts);
//     };

//     calculateTotals();
//   }, [data, selectedProducts]);

//   // const handleProductSelection = (cartId: string, isSelected: boolean) => {
//   //   setSelectedProducts((prevSelectedProducts) => {
//   //     if (isSelected) {
//   //       return [...prevSelectedProducts, cartId];
//   //     } else {
//   //       return prevSelectedProducts.filter((id) => id !== cartId);
//   //     }
//   //   });
//   // };

//   // const handleShopSelection = (shopId: string, isSelected: boolean) => {
//   //   data.listCartByShopDTOs.forEach((shopData: any) => {
//   //     if (shopData.shopId === shopId) {
//   //       shopData.carts.forEach((cart: any) => {
//   //         handleProductSelection(cart.cartId, isSelected);
//   //       });
//   //     }
//   //   });
//   // };

//   return (
//     <>
//       <div className="flex bg-gray-100 h-full w-full py-8 mt-44">
//         <div className="container mx-full px-16">
//           <h1 className="ext-2xl font-semibold mb-4">Shopping Cart</h1>
//           <div className="flex flex-col gap-4">
//             {data
//               ? data.listCartByShopDTOs.map((item: any) => (
//                   <ShopSection
//                     key={item.shopId}
//                     data={item}
//                     selectedProducts={selectedProducts}
//                     setSelectedProducts={setSelectedProducts}
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
//                   <span>{totalPrice.toFixed(2)} VNĐ</span>
//                 </div>
//                 <hr className="my-2" />
//                 <div className="flex justify-between mb-2">
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
//                   onClick={() => handleCreateOrder(selectedProducts)}
//                   disabled={isLoading}
//                 >
//                   Mua hàng
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
