import {
  useDeleteCartMutation,
  useUpdateCartMutation,
} from "@/redux/features/common/cart/cartApiSlice";
import { Cart } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
import { useState } from "react";

interface CartItemProps {
  cart: Cart;
  isSelected: boolean;
  onToggleProductCheckbox: (cartId: string) => void;
  onItemDeleted: (cartId: string) => void;
  onRefresh: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  cart,
  isSelected,
  onToggleProductCheckbox,
  onItemDeleted,
  onRefresh,
}) => {
  const [deleteCart] = useDeleteCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [quantity, setQuantity] = useState(cart.quantity);

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const handleQuantityChange = async (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;

    setQuantity(newQuantity);

    try {
      await updateCart({
        cartId: cart.cartId,
        quantity: change,
      });
      onRefresh();
    } catch (e) {
      console.log("error", e);
      setQuantity(quantity); // Revert if update fails
    }
  };

  const toggleSelection = () => {
    onToggleProductCheckbox(cart.cartId);
  };

  const handleDeleteCartItem = async () => {
    try {
      await deleteCart(cart.cartId);
      onItemDeleted(cart.cartId);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return (
    <tr
      className={`${isSelected ? "bg-blue-50" : "bg-white"} hover:bg-gray-50 transition-colors duration-200`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <input
            id={`product-checkbox-${cart.cartId}`}
            type="checkbox"
            checked={isSelected}
            onChange={toggleSelection}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <img
            className="h-20 w-20 object-cover ml-4"
            src={cart.productImage}
            alt={`Product image for ${cart.productName}`}
          />
          <span className="ml-4 text-sm font-medium text-gray-900 line-clamp-2 w-48">
            {cart.productName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {cart.productVariantDTO.attributeDTOs.map((attr, index) => (
            <div key={attr.attributeId}>
              <span className="font-medium">{attr.name}:</span> {attr.value}
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatPrice(cart.productVariantDTO.price)} VNĐ
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-8 w-8 rounded-l-md transition-colors duration-200"
          >
            -
          </button>
          <span className="bg-gray-100 text-gray-800 font-medium h-8 w-12 flex items-center justify-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-8 w-8 rounded-r-md transition-colors duration-200"
          >
            +
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatPrice(cart.productVariantDTO.price * quantity)} VNĐ
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleDeleteCartItem}
          className="text-red-600 hover:text-red-900 transition-colors duration-200"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

// import {
//   useDeleteCartMutation,
//   useUpdateCartMutation,
// } from "@/redux/features/common/cart/cartApiSlice";
// import {
//   Cart,
//   ListCartByShopDTO,
// } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
// import { useState } from "react";

// interface CartItemProps {
//   cart: Cart;
//   isSelected: boolean;
//   onToggleProductCheckbox: (cartId: string) => void;
//   setRenderData: React.Dispatch<React.SetStateAction<ListCartByShopDTO>>;
//   setDeletedCartIds: React.Dispatch<React.SetStateAction<string>>;
// }
// export const CartItem: React.FC<CartItemProps> = ({
//   cart,
//   isSelected,
//   onToggleProductCheckbox,
//   setDeletedCartIds,
// }) => {
//   const [deleteCart] = useDeleteCartMutation();
//   const [updateCart] = useUpdateCartMutation();
//   const [quantity, setQuantity] = useState(cart.quantity);

//   const formatPrice = (price: number) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };

//   const handleQuantityChange = async (change: number) => {
//     const newQuantity = quantity + change;
//     setQuantity(newQuantity);

//     try {
//       await updateCart({
//         cartId: cart.cartId,
//         quantity: change,
//       });
//     } catch (e) {
//       console.log("error", e);
//     }
//   };

//   const toggleSelection = () => {
//     onToggleProductCheckbox(cart.cartId);
//   };

//   const handleDeleteCartItem = async () => {
//     try {
//       await deleteCart(cart.cartId);
//       console.log("Deleted cart item with id:", cart.cartId);
//       setDeletedCartIds(cart.cartId);
//       // setRenderData((prevRenderData) => {
//       //   console.log("prevRenderData trong handle delete: ", prevRenderData);
//       //   const updatedCarts = prevRenderData.carts.filter(
//       //     (cartItem) => cartItem.cartId !== cart.cartId
//       //   );
//       //   console.log("updatedCarts trong handle delete: ", updatedCarts);
//       //   return {
//       //     ...prevRenderData,
//       //     carts: updatedCarts,
//       //   };
//       // });
//     } catch (error) {
//       console.error("Error deleting cart item:", error);
//     }
//   };

//   return (
//     <tr className={`bg-white ${isSelected ? "bg-gray-100" : ""}`}>
//       <td className="py-4">
//         <div className="flex items-center">
//           <input
//             id={`product-checkbox-${cart.cartId}-cart-item`}
//             type="checkbox"
//             checked={isSelected}
//             onChange={toggleSelection}
//             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 px-2"
//           />
//           <img
//             className="h-28 w-28 mr-4 mx-2"
//             src={cart.productImage}
//             alt={`Product image for ${cart.productName}`}
//           />
//           <span className="w-72 flex font-semibold overflow-hidden line-clamp-2">
//             {cart.productName}
//           </span>
//         </div>
//       </td>
//       <td className="py-4">
//         <div className="flex flex-col">
//           {cart.productVariantDTO.attributeDTOs.map((attr) => (
//             <span key={attr.attributeId} className="flex">
//               <span className="font-semibold mr-2">{attr.name}:</span>
//               <span>{attr.value}</span>
//             </span>
//           ))}
//         </div>
//       </td>
//       <td className="py-4">{formatPrice(cart.productVariantDTO.price)} VNĐ</td>
//       <td className="py-4">
//         <div className="flex items-center w-1/2 rounded-full border-gray-200 bg-white">
//           <button
//             onClick={() => handleQuantityChange(-1)}
//             className="border rounded-md py-2 px-4 mr-2"
//           >
//             -
//           </button>
//           <span className="text-center w-8">{quantity}</span>
//           <button
//             onClick={() => handleQuantityChange(1)}
//             className="border rounded-md py-2 px-4 ml-2"
//           >
//             +
//           </button>
//         </div>
//       </td>
//       <td className="py-4">
//         {formatPrice(cart.productVariantDTO.price * quantity)} VNĐ
//       </td>
//       <td className="py-4">
//         <div className="w-full">
//           <button
//             type="button"
//             onClick={handleDeleteCartItem}
//             className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700"
//           >
//             XÓA
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// };
