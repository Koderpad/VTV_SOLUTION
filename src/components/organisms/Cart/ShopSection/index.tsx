import React, { useEffect } from "react";
import { CartItem } from "./CartItem";
import {
  Cart,
  ListCartByShopDTO,
} from "@/utils/DTOs/common/Cart/Response/ListCartResponse";

interface VoucherComponentProps {
  data: ListCartByShopDTO;
  refetchData: () => void;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ShopSection: React.FC<VoucherComponentProps> = ({
  data,
  refetchData,
  selectedProducts,
  setSelectedProducts,
}) => {
  const [isShopCheckboxChecked, setShopCheckboxChecked] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<Cart[]>(data.carts);

  useEffect(() => {
    //check if have product selected but is deleted and not face cartItem then update selectedProducts
    setSelectedProducts((prevSelectedProducts) => {
      const newSelectedProducts = prevSelectedProducts.filter((id) =>
        cartItems.find((cart) => cart.cartId === id.toString())
      );
      setShopCheckboxChecked(newSelectedProducts.length === cartItems.length);
      return newSelectedProducts;
    });
  }, [cartItems]);

  const toggleShopCheckbox = () => {
    alert("toggleShopCheckbox");
    setShopCheckboxChecked(!isShopCheckboxChecked);
    if (!isShopCheckboxChecked) {
      setSelectedProducts(cartItems.map((cart) => cart.cartId));
    } else {
      setSelectedProducts([]);
    }
  };

  const toggleProductCheckbox = (cartId: string) => {
    setSelectedProducts((prevSelectedProducts) => {
      const isSelected = prevSelectedProducts.includes(cartId.toString());
      const newSelectedProducts = isSelected
        ? prevSelectedProducts.filter((id) => id !== cartId.toString())
        : [...prevSelectedProducts, cartId.toString()];
      setShopCheckboxChecked(newSelectedProducts.length === cartItems.length);
      return newSelectedProducts;
    });
  };

  const isProductSelected = (cartId: string) => {
    console.log("cartId", cartId);
    console.log("selectedProducts", selectedProducts);
    return selectedProducts.includes(cartId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div>
        <input
          id="shop-checkbox"
          type="checkbox"
          checked={isShopCheckboxChecked}
          onChange={toggleShopCheckbox}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 px-2"
        />
        <label
          htmlFor="shop-checkbox"
          className="ms-2 mx-2 text-xl font-semibold text-gray-900 dark:text-gray-300"
        >
          {data.shopName}
        </label>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left font-semibold">Product</th>
            <th className="text-left font-semibold">Phân loại</th>
            <th className="text-left font-semibold">Giá</th>
            <th className="text-left font-semibold">Số lượng</th>
            <th className="text-left font-semibold">Tổng giá</th>
            <th className="text-left font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="flex-col md:flex-row gap-4">
          {cartItems.map((cart) => (
            <CartItem
              key={cart.cartId}
              cart={cart}
              setCartItems={setCartItems}
              isSelected={
                isProductSelected(cart.cartId) || isShopCheckboxChecked
              }
              onToggleProductCheckbox={toggleProductCheckbox}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// import React, { useEffect, useState } from "react";
// import { CartItem } from "./CartItem";
// import {
//   Cart,
//   ListCartByShopDTO,
// } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";

// interface VoucherComponentProps {
//   data: ListCartByShopDTO;
//   refetchData: () => void;
// }

// export const ShopSection: React.FC<VoucherComponentProps> = ({
//   data,
//   refetchData,
// }) => {
//   const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
//   const [isShopCheckboxChecked, setShopCheckboxChecked] = useState(false);
//   const [cartItems, setCartItems] = useState<Cart[]>(data.carts);

//   useEffect(() => {
//     refetchData();
//   }, [cartItems]);

//   const toggleShopCheckbox = () => {
//     setShopCheckboxChecked(!isShopCheckboxChecked);
//     if (!isShopCheckboxChecked) {
//       setSelectedProducts(cartItems.map((cart) => Number(cart.cartId)));
//     } else {
//       setSelectedProducts([]);
//     }
//   };

//   const toggleProductCheckbox = (cartId: number) => {
//     setSelectedProducts((prevSelectedProducts) => {
//       const isSelected = prevSelectedProducts.includes(cartId);
//       const newSelectedProducts = isSelected
//         ? prevSelectedProducts.filter((id) => id !== cartId)
//         : [...prevSelectedProducts, cartId];

//       setShopCheckboxChecked(newSelectedProducts.length === cartItems.length);

//       return newSelectedProducts;
//     });
//   };

//   const isProductSelected = (cartId: number) => {
//     return selectedProducts.includes(cartId);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-4">
//       <div>
//         <input
//           id="shop-checkbox"
//           type="checkbox"
//           checked={isShopCheckboxChecked}
//           onChange={toggleShopCheckbox}
//           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 px-2"
//         />
//         <label
//           htmlFor="shop-checkbox"
//           className="ms-2 mx-2 text-xl font-semibold text-gray-900 dark:text-gray-300"
//         >
//           {data.shopName}
//         </label>
//       </div>
//       <table className="w-full">
//         <thead>
//           <tr>
//             <th className="text-left font-semibold">Product</th>
//             <th className="text-left font-semibold">Phân loại</th>
//             <th className="text-left font-semibold">Giá</th>
//             <th className="text-left font-semibold">Số lượng</th>
//             <th className="text-left font-semibold">Tổng giá</th>
//             <th className="text-left font-semibold">Thao tác</th>
//           </tr>
//         </thead>
//         <tbody className="flex-col md:flex-row gap-4">
//           {cartItems.map((cart) => (
//             <CartItem
//               key={cart.cartId}
//               cart={cart}
//               setCartItems={setCartItems}
//               isSelected={
//                 isProductSelected(Number(cart.cartId)) || isShopCheckboxChecked
//               }
//               onToggleProductCheckbox={toggleProductCheckbox}
//             />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
