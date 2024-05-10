import { Cart } from "@/components/organisms/Cart";
import { useGetListCartByUsernameQuery } from "@/redux/features/common/cart/cartApiSlice";
import { useCreateMultiOrderMutation } from "@/redux/features/common/order/orderApiSlice";
import { MultipleOrderResponse } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AES } from "crypto-js";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ServerError {
  status: string;
  message: string;
  code: number;
}

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
      const orderCreationResult = await createOrder(cartIds);

      if ("data" in orderCreationResult) {
        // Xử lý khi có dữ liệu trả về
        // ...
        const result = orderCreationResult.data;

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
        const error = orderCreationResult.error;
        if ("status" in error) {
          // Lỗi từ server (FetchBaseQueryError)
          const serverError = error.data as ServerError;
          if (
            serverError.status === "NOT_FOUND" &&
            serverError.message === "Thông báo: Khách hàng chưa có địa chỉ nào."
          ) {
            alert(serverError.message);
            // navigate("/user/account/address");
          } else {
            alert(`Lỗi từ server: ${serverError.message}`);
          }
        } else {
          // Lỗi không xác định (SerializedError)
          alert("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
    }
  };

  // const handleCreateOrder = async (cartIds: string[]) => {
  //   try {
  //     const orderCreationResult:
  //       | {
  //           data: MultipleOrderResponse;
  //         }
  //       | {
  //           error:
  //             | FetchBaseQueryError
  //             | SerializedError
  //             | { message: string; status: string; code: number };
  //         } = await createOrder(cartIds);

  //     if ("data" in orderCreationResult) {
  //       const result = orderCreationResult.data;
  //       if (result.code !== 200) {
  //         if (
  //           result.message === "Thông báo: Khách hàng chưa có địa chỉ nào." &&
  //           result.status === "NOT_FOUND"
  //         ) {
  //           alert("Địa chỉ của bạn chưa có, vui lòng thêm địa chỉ!");
  //           // navigate("/user/account/address");
  //           return;
  //         }
  //       }
  //       // handle encrypt state
  //       const stateString = JSON.stringify(result);
  //       const encryptedState = AES.encrypt(
  //         stateString,
  //         "vtv-secret-key-2024"
  //       ).toString();
  //       const urlSafeEncryptedState = encodeURIComponent(encryptedState);
  //       console.log("urlSafeEncryptedState: ", urlSafeEncryptedState);
  //       // navigate to checkout page with encrypted state
  //       navigate(`/checkout?state=${urlSafeEncryptedState}`);
  //     } else {
  //       alert("Error: " + orderCreationResult.error);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false); // Ẩn modal loading
  //   }
  // };

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
