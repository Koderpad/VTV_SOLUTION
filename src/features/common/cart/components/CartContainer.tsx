import { Cart } from "@/components/organisms/Cart";
import { useGetListCartByUsernameQuery } from "@/redux/features/cart/cartApiSlice";
import { useCreateMultiOrderMutation } from "@/redux/features/order/orderApiSlice";
import { MultipleOrderResponse } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AES } from "crypto-js";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const CartContainer = () => {
  const { data, isLoading, refetch } = useGetListCartByUsernameQuery();
  const [
    createOrder,
    { isLoading: isLoadingOrder, isError: isErrorOrder, data: orderData },
  ] = useCreateMultiOrderMutation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const selectedProducts: string[] = [];

  const handleCreateOrder = async (cartIds: string[]) => {
    try {
      const orderCreationResult:
        | { data: MultipleOrderResponse }
        | { error: FetchBaseQueryError | SerializedError } =
        await createOrder(cartIds);

      if ("data" in orderCreationResult) {
        const result = orderCreationResult.data;
        // handle error in server response
        if (result.code !== 200) {
          if (
            result.message === "Thông báo: Khách hàng chưa có địa chỉ nào." &&
            result.status === "404 NOT_FOUND"
          ) {
            alert("Địa chỉ của bạn chưa có, vui lòng thêm địa chỉ!");
            navigate("/user/account/address");
            return;
          }
        }

        // handle encrypt state
        const stateString = JSON.stringify(result);
        const encryptedState = AES.encrypt(
          stateString,
          "vtv-secret-key-2024"
        ).toString();
        const urlSafeEncryptedState = encodeURIComponent(encryptedState);
        console.log("urlSafeEncryptedState: ", urlSafeEncryptedState);
        // navigate to checkout page with encrypted state
        navigate(`/checkout?state=${urlSafeEncryptedState}`);
      } else {
        // handle error in fetching data
        const error = orderCreationResult.error;
        alert("Error: " + error);
      }

      // await new Promise((resolve) => setTimeout(resolve, 500));

      // encrypt state

      // navigate("/checkout", { state: { res: orderCreationResult } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ẩn modal loading
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Cart is empty</p>
      </div>
    );
  }

  return (
    <Cart
      data={data}
      isLoading={isLoading}
      refetch={refetch}
      handleCreateOrder={handleCreateOrder}
    />
  );
};
