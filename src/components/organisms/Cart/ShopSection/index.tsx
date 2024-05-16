import React, { useEffect } from "react";
import { CartItem } from "./CartItem";
import {
  ListCartByShopDTO,
} from "@/utils/DTOs/common/Cart/Response/ListCartResponse";

interface VoucherComponentProps {
  data: ListCartByShopDTO;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ShopSection: React.FC<VoucherComponentProps> = ({
  data,
  selectedProducts,
  setSelectedProducts,
}) => {
  const [isShopCheckboxChecked, setShopCheckboxChecked] = React.useState(false);
  const [renderData, setRenderData] = React.useState(data);
  const [deletedCartIds, setDeletedCartIds] = React.useState<string>("");

  useEffect(() => {
    const isAllProductsSelected = renderData.carts.every((cart) =>
      selectedProducts.includes(cart.cartId)
    );
    setShopCheckboxChecked(isAllProductsSelected);
  }, [renderData.carts, selectedProducts]);

  useEffect(() => {
    if (deletedCartIds === "") {
      return;
    }

    setRenderData((prevRenderData) => {
      const updatedCarts = prevRenderData.carts.filter(
        (cartItem) => cartItem.cartId !== deletedCartIds
      );
      return {
        ...prevRenderData,
        carts: updatedCarts,
      };
    });

    setSelectedProducts((prevSelectedProducts) => {
      console.log("prevSelectedProducts: ", prevSelectedProducts);
      const newSelectedProducts = prevSelectedProducts.filter(
        (id) => id !== deletedCartIds
      );
      setShopCheckboxChecked(
        newSelectedProducts.length === renderData.carts.length
      );
      console.log("newSelectedProducts: ", newSelectedProducts);
      return newSelectedProducts;
    });
  }, [deletedCartIds]);

  const toggleShopCheckbox = () => {
    setSelectedProducts((prevSelectedProducts) => {
      if (isShopCheckboxChecked) {
        return prevSelectedProducts.filter(
          (id) => !renderData.carts.some((cart) => cart.cartId === id)
        );
      } else {
        const cartIds = renderData.carts.map((cart) => cart.cartId);
        return [...prevSelectedProducts, ...cartIds];
      }
    });
  };

  const toggleProductCheckbox = (cartId: string) => {
    setSelectedProducts((prevSelectedProducts) => {
      const isSelected = prevSelectedProducts.includes(cartId);
      if (isSelected) {
        return prevSelectedProducts.filter((id) => id !== cartId);
      } else {
        return [...prevSelectedProducts, cartId];
      }
    });
  };

  const isProductSelected = (cartId: string) => {
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
          {renderData.shopName}
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
          {renderData.carts.map((cart) => (
            <CartItem
              key={cart.cartId}
              cart={cart}
              isSelected={
                isProductSelected(cart.cartId) || isShopCheckboxChecked
              }
              onToggleProductCheckbox={toggleProductCheckbox}
              setRenderData={setRenderData}
              setDeletedCartIds={setDeletedCartIds}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
