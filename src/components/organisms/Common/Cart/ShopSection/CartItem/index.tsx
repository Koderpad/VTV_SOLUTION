import {
  useDeleteCartMutation,
  useUpdateCartMutation,
} from "@/redux/features/common/cart/cartApiSlice";
import {
  Cart,
  ListCartByShopDTO,
} from "@/utils/DTOs/common/Cart/Response/ListCartResponse";
import { useState } from "react";

interface CartItemProps {
  cart: Cart;
  isSelected: boolean;
  onToggleProductCheckbox: (cartId: string) => void;
  setRenderData: React.Dispatch<React.SetStateAction<ListCartByShopDTO>>;
  setDeletedCartIds: React.Dispatch<React.SetStateAction<string>>;
}
export const CartItem: React.FC<CartItemProps> = ({
  cart,
  isSelected,
  onToggleProductCheckbox,
  setDeletedCartIds,
}) => {
  const [deleteCart] = useDeleteCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [quantity, setQuantity] = useState(cart.quantity);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleQuantityChange = async (change: number) => {
    const newQuantity = quantity + change;
    setQuantity(newQuantity);

    try {
      await updateCart({
        cartId: cart.cartId,
        quantity: change,
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  const toggleSelection = () => {
    onToggleProductCheckbox(cart.cartId);
  };

  const handleDeleteCartItem = async () => {
    try {
      await deleteCart(cart.cartId);
      console.log("Deleted cart item with id:", cart.cartId);
      setDeletedCartIds(cart.cartId);
      // setRenderData((prevRenderData) => {
      //   console.log("prevRenderData trong handle delete: ", prevRenderData);
      //   const updatedCarts = prevRenderData.carts.filter(
      //     (cartItem) => cartItem.cartId !== cart.cartId
      //   );
      //   console.log("updatedCarts trong handle delete: ", updatedCarts);
      //   return {
      //     ...prevRenderData,
      //     carts: updatedCarts,
      //   };
      // });
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return (
    <tr className={`bg-white ${isSelected ? "bg-gray-100" : ""}`}>
      <td className="py-4">
        <div className="flex items-center">
          <input
            id={`product-checkbox-${cart.cartId}-cart-item`}
            type="checkbox"
            checked={isSelected}
            onChange={toggleSelection}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 px-2"
          />
          <img
            className="h-28 w-28 mr-4 mx-2"
            src={cart.productImage}
            alt={`Product image for ${cart.productName}`}
          />
          <span className="w-72 flex font-semibold overflow-hidden line-clamp-2">
            {cart.productName}
          </span>
        </div>
      </td>
      <td className="py-4">
        <div className="flex flex-col">
          {cart.productVariantDTO.attributeDTOs.map((attr) => (
            <span key={attr.attributeId} className="flex">
              <span className="font-semibold mr-2">{attr.name}:</span>
              <span>{attr.value}</span>
            </span>
          ))}
        </div>
      </td>
      <td className="py-4">{formatPrice(cart.productVariantDTO.price)} VNĐ</td>
      <td className="py-4">
        <div className="flex items-center w-1/2 rounded-full border-gray-200 bg-white">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="border rounded-md py-2 px-4 mr-2"
          >
            -
          </button>
          <span className="text-center w-8">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="border rounded-md py-2 px-4 ml-2"
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4">
        {formatPrice(cart.productVariantDTO.price * quantity)} VNĐ
      </td>
      <td className="py-4">
        <div className="w-full">
          <button
            type="button"
            onClick={handleDeleteCartItem}
            className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700"
          >
            XÓA
          </button>
        </div>
      </td>
    </tr>
  );
};
