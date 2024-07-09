import { useEffect, useRef, useState } from "react";
import {
  useAddOrderByProductVariantMutation,
  useUpdateOrderByProductVariantMutation,
} from "../../../../redux/features/common/order/orderApiSlice";

import { AES, enc } from "crypto-js";
import {
  AddressDTO,
  OrderResponse,
} from "@/utils/DTOs/common/Order/Response/OrderResponse";
import { OrderRequestWithProductVariant } from "@/utils/DTOs/common/Order/Request/OrderRequestWithProductVariant";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVoucherByVoucherId } from "@/services/common/VoucherService";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { useCreateVNPayPaymentMutation } from "@/redux/features/common/order/vnPayApiSlice";
import { Order } from "@/components/organisms/Common/OrderWithProductVariant";

export const OrderContainerWithProductVariant = () => {
  const [createVNPayPayment] = useCreateVNPayPaymentMutation();
  const [updateOrderByProductVariant] =
    useUpdateOrderByProductVariantMutation();
  const [addOrderByProductVariant] = useAddOrderByProductVariantMutation();

  const [isUpdating, setIsUpdating] = useState(false);
  const shouldUpdateFromURL = useRef(true);
  const [isLoading, setIsLoading] = useState(true);

  const [orderResponseFromURL, setOrderResponseFromURL] =
    useState<OrderResponse | null>(null);

  const [orderRequest, setOrderRequest] =
    useState<OrderRequestWithProductVariant | null>(null);

  const [address, setAddress] = useState<AddressDTO | null>(null);

  const [systemVoucherNameAndId, setSystemVoucherNameAndId] = useState<{
    name: string;
    id: number;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const [updatedOrderRequests, setUpdatedOrderRequests] =
    useState<Partial<OrderRequestWithProductVariant>>();

  // Hàm cập nhật thông tin đơn hàng khi người dùng thay đổi
  const updateOrderRequest = (
    updates: Partial<OrderRequestWithProductVariant>
  ) => {
    setUpdatedOrderRequests(updates);
  };

  //Cập nhật orderRequest khi có thay đổi từ người dùng
  useEffect(() => {
    console.log("Updated Order Requests: ", updatedOrderRequests);

    if (!updatedOrderRequests || !orderResponseFromURL) return;

    const updatedOrderRequestWithVariant = async () => {
      try {
        const { orderDTO } = orderResponseFromURL;
        const updates = updatedOrderRequests;
        console.log("note: ", updates.note);
        const shopVoucherCode = await getShopVoucherCode(orderDTO);
        const systemVoucherCode = await getSystemVoucherCode(orderDTO);

        const final: OrderRequestWithProductVariant = {
          addressId: updates.addressId || orderDTO.addressDTO.addressId,
          systemVoucherCode:
            updates.systemVoucherCode === "CANCEL"
              ? undefined
              : updates.systemVoucherCode || systemVoucherCode,
          shopVoucherCode:
            updates.shopVoucherCode === "CANCEL"
              ? undefined
              : updates.shopVoucherCode || shopVoucherCode,
          paymentMethod: updates.paymentMethod || orderDTO.paymentMethod,
          shippingMethod: updates.shippingMethod || orderDTO.shippingMethod,
          note: updates.note !== undefined ? updates.note : orderDTO.note || "",
          useLoyaltyPoint:
            updates.useLoyaltyPoint !== undefined
              ? updates.useLoyaltyPoint
              : !!orderDTO.loyaltyPointHistoryDTO,

          productVariantIdsAndQuantities: {
            ...orderDTO.orderItemDTOs.reduce(
              (acc, item) => {
                acc[item.productVariantDTO.productVariantId] = item.quantity;
                return acc;
              },
              {} as Record<string, number>
            ),
            ...updates.productVariantIdsAndQuantities,
          },
        };

        return final;
      } catch (error) {
        console.error("Error when updating order request: ", error);
      }
    };

    updatedOrderRequestWithVariant().then((x) => {
      console.log("xxx: ", x);
      if (x) setOrderRequest(x);
    });
  }, [updatedOrderRequests]);

  // Cập nhật dữ liệu từ URL
  useEffect(() => {
    const fetchData = async () => {
      if (shouldUpdateFromURL.current) {
        const orderResponseFromURL = getOrderResponseFromURL();

        if (orderResponseFromURL) {
          setOrderResponseFromURL(orderResponseFromURL);

          setAddress(orderResponseFromURL.orderDTO.addressDTO);

          setSystemVoucherNameAndId(() => {
            if (!orderResponseFromURL.orderDTO.voucherOrderDTOs) return null;
            const systemVoucher =
              orderResponseFromURL.orderDTO.voucherOrderDTOs.find(
                (voucher) => !voucher.type
              );
            return systemVoucher
              ? { name: systemVoucher.voucherName, id: systemVoucher.voucherId }
              : null;
          });

          setPaymentMethod(
            orderResponseFromURL.orderDTO.paymentMethod || "COD"
          );
        }
        shouldUpdateFromURL.current = false;
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shouldUpdateFromURL.current]);

  useEffect(() => {
    console.log("Order Request: ", orderRequest);
    if (orderRequest && !isUpdating) {
      handleUpdateOrder(orderRequest);
    }
  }, [orderRequest]);

  const handleUpdateOrder = async (
    updatedOrderRequest: OrderRequestWithProductVariant
  ) => {
    if (!isUpdating) {
      setIsUpdating(true);
      try {
        const updateOrderResponse =
          await updateOrderByProductVariant(updatedOrderRequest).unwrap();

        if (updateOrderResponse) {
          toast("Cập nhật đơn hàng thành công", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          updateURL(updateOrderResponse);
          shouldUpdateFromURL.current = true;
        } else {
          toast.error("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau");
        }
      } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        toast.error("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau");
      }
      setIsUpdating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderRequest) {
      toast.error("Không có thông tin đơn hàng để xử lý");
      return;
    }

    handleApiCall<OrderResponse, ServerError>({
      callbackFn: async () => {
        return await addOrderByProductVariant(orderRequest);
      },
      successCallback: async (data) => {
        if (data.orderDTO.paymentMethod === "VNPay") {
          try {
            sessionStorage.setItem("checkoutState", JSON.stringify(data));
            const response = await createVNPayPayment([
              data.orderDTO.orderId,
            ]).unwrap();
            if (response.code === 200) {
              const vnpUrl = new URL(response.url);
              window.location.href = vnpUrl.toString();
            } else {
              alert("Tạo thanh toán VNPay thất bại");
              window.history.back();
            }
          } catch (error) {
            alert("Lỗi khi tạo thanh toán VNPay: " + error);
            window.history.back();
          }
        } else {
          alert("Đặt hàng thành công");
          window.location.href = "/user/account/history-purchase";
        }
      },
      errorFromServerCallback: (error) => {
        alert("Đặt hàng thất bại: " + error.message);
      },
      errorSerializedCallback: (error) => {
        alert("Lỗi đặt hàng: " + error.message);
      },
      errorCallback: (error) => {
        alert("Lỗi đặt hàng: " + error);
      },
    });
  };

  return (
    <>
      {isLoading || !address || !paymentMethod || !orderResponseFromURL ? (
        <div>Loading...</div>
      ) : (
        <Order
          priceDataFromOrderResponse={orderResponseFromURL}
          address={address}
          systemVoucherNameAndId={systemVoucherNameAndId}
          paymentMethod={paymentMethod}
          updateOrderRequest={updateOrderRequest}
          handlePlaceOrder={handlePlaceOrder}
        />
      )}
      <ToastContainer />
    </>
  );
};

const getOrderResponseFromURL = (): OrderResponse | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = urlParams.get("state");
  if (!params) {
    alert("Invalid state");
    return null;
  }
  try {
    const encryptedState = decodeURIComponent(params);
    const decryptedState = AES.decrypt(
      encryptedState,
      "vtv-secret-key-2024"
    ).toString(enc.Utf8);
    return JSON.parse(decryptedState);
  } catch (error) {
    console.error("Error parsing URL state:", error);
    return null;
  }
};

const getSystemVoucherCode = async (orderDTO: any) => {
  const systemVoucher = orderDTO.voucherOrderDTOs?.find(
    (voucher: any) => voucher.type === false
  );
  const id = systemVoucher?.voucherId.toString() || "";
  if (id !== "" && id) {
    try {
      const data = await getVoucherByVoucherId(id);
      return data.voucherDTO.code;
    } catch (error) {
      console.error("Failed to fetch system voucher:", error);
    }
  }
  return undefined;
};

const getShopVoucherCode = async (orderDTO: any) => {
  const shopVoucher = orderDTO.voucherOrderDTOs?.find(
    (voucher: any) => voucher.type === true
  );
  const id = shopVoucher?.voucherId.toString() || "";
  if (id !== "" && id) {
    try {
      const data = await getVoucherByVoucherId(id);
      return data.voucherDTO.code;
    } catch (error) {
      console.error("Failed to fetch shop voucher:", error);
    }
  }
  return undefined;
};

const updateURL = (orderResponse: OrderResponse) => {
  const updatedStateString = JSON.stringify(orderResponse);
  const encryptedUpdatedState = AES.encrypt(
    updatedStateString,
    "vtv-secret-key-2024"
  ).toString();
  const urlSafeEncryptedUpdatedState = encodeURIComponent(
    encryptedUpdatedState
  );
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?state=${urlSafeEncryptedUpdatedState}`;
  window.history.replaceState({}, "", newUrl);
};
