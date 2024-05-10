import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateOrderMutation,
  useCreateUpdateOrderMutation,
  useUpdateMultiOrderMutation,
} from "../../../../redux/features/common/order/orderApiSlice";
import { Order } from "@/components/organisms/Order";
import { AES, enc } from "crypto-js";
import {
  AddressDTO,
  MultipleOrderResponse,
} from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
import {
  MultipleOrderRequestWithCart,
  OrderRequestWithCart,
} from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVoucherByVoucherId } from "@/services/common/VoucherService";

export const OrderContainer = () => {
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [createUpdateOrder] = useCreateUpdateOrderMutation();
  const [updateMultiOrder] = useUpdateMultiOrderMutation();

  const [isUpdating, setIsUpdating] = useState(false);
  const shouldUpdateFromURL = useRef(true);

  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu đơn hàng từ URL
  const [multipleOrderResponse, setMultipleOrderResponse] =
    useState<MultipleOrderResponse>();

  // Khởi tạo state cho thông tin đơn hàng và thanh toán
  const [orderRequestWithCarts, setOrderRequestWithCarts] =
    useState<MultipleOrderRequestWithCart>();
  const [address, setAddress] = useState<AddressDTO>();
  const [systemVoucherNameAndId, setSystemVoucherNameAndId] = useState<{
    name: string;
    id: number;
  }>();
  const [paymentMethod, setPaymentMethod] = useState<string>();
  const [updatedOrderRequests, setUpdatedOrderRequests] =
    useState<Partial<OrderRequestWithCart>[]>();

  // Hàm cập nhật thông tin đơn hàng khi người dùng thay đổi
  const updateOrderRequest = (
    index: number,
    updates: Partial<OrderRequestWithCart>
  ) => {
    const updatedDate: Partial<OrderRequestWithCart>[] = [];
    multipleOrderResponse!.orderResponses.forEach(() => {
      updatedDate.push({});
    });
    if (index === -1) {
      updatedDate.forEach((order) => {
        Object.assign(order, updates);
      });
    } else {
      Object.assign(updatedDate[index], updates);
    }
    setUpdatedOrderRequests(updatedDate);
  };

  // Cập nhật orderRequestWithCarts khi có thay đổi từ người dùng
  useEffect(() => {
    console.log("Updated Order Requests: ", updatedOrderRequests);
    if (!multipleOrderResponse || !updatedOrderRequests) {
      return;
    }

    if (
      updatedOrderRequests.length !==
      multipleOrderResponse.orderResponses.length
    ) {
      return;
    }

    const neccessaryOrderResponses = getNeccessaryOrderResponses(
      multipleOrderResponse
    );
    const updatedOrderRequestWithCarts: Promise<OrderRequestWithCart[]> =
      Promise.all(
        neccessaryOrderResponses.map(async (orderResponse, index) => {
          const { orderDTO } = orderResponse;
          const updates = updatedOrderRequests[index];
          const shopVoucherCode = await getShopVoucherCode(orderDTO);
          const systemVoucherCode = await getSystemVoucherCode(orderDTO);

          return {
            addressId: orderDTO.addressDTO.addressId,
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
            note: updates.note || orderDTO.note || "",
            useLoyaltyPoint:
              updates.useLoyaltyPoint !== undefined
                ? updates.useLoyaltyPoint
                : !!orderDTO.loyaltyPointHistoryDTO,

            cartIds: orderDTO.orderItemDTOs.map(({ cartId }) => cartId),
          };
        })
      );

    // Sử dụng finalOrderRequestWithCarts
    updatedOrderRequestWithCarts
      .then((finalOrderRequestWithCarts) => {
        // Sử dụng finalOrderRequestWithCarts
        console.log(
          "Updated Order Request With Carts: ",
          finalOrderRequestWithCarts
        );

        setOrderRequestWithCarts({
          orderRequestWithCarts: finalOrderRequestWithCarts,
        });
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
      });
  }, [updatedOrderRequests]);

  // Cập nhật dữ liệu từ URL
  useEffect(() => {
    const fetchData = () => {
      if (shouldUpdateFromURL.current) {
        const multipleOrderResponse: MultipleOrderResponse =
          getMultipleOrderResponseFromURL();

        setMultipleOrderResponse(multipleOrderResponse);

        const neccessaryOrderResponses = getNeccessaryOrderResponses(
          multipleOrderResponse
        );
        setAddress(neccessaryOrderResponses[0]?.orderDTO.addressDTO);
        setSystemVoucherNameAndId(() => {
          console.log("System Voucher 0000: ", neccessaryOrderResponses[0]);
          if (neccessaryOrderResponses[0]?.orderDTO.voucherOrderDTOs) {
            const systemVoucher =
              neccessaryOrderResponses[0]?.orderDTO.voucherOrderDTOs.find(
                (voucher) => !voucher.type
              );
            console.log("System Voucher: ", systemVoucher);
            if (systemVoucher) {
              return {
                name: systemVoucher.voucherName,
                id: systemVoucher.voucherId,
              };
            }
          }
          console.log("System Voucher 1111: ", undefined);
          return undefined;
        });

        setPaymentMethod(
          neccessaryOrderResponses[0]?.orderDTO.paymentMethod || "COD"
        );

        shouldUpdateFromURL.current = false;
        setIsLoading(false); // Cập nhật isLoading thành false sau khi tải dữ liệu xong
      }
    };

    fetchData();
  }, [shouldUpdateFromURL.current]);

  useEffect(() => {
    console.log("sys: ", systemVoucherNameAndId);
  }, [systemVoucherNameAndId]);

  // Xử lý đặt hàng khi orderRequestWithCarts thay đổi
  const trustedOrderRequestWithCarts = (
    orderRequestWithCarts: MultipleOrderRequestWithCart
  ) => {
    return {
      orderRequestWithCarts: orderRequestWithCarts.orderRequestWithCarts.map(
        (orderRequestWithCart) => {
          const { systemVoucherCode, shopVoucherCode, ...rest } =
            orderRequestWithCart;

          let updatedOrderRequest = orderRequestWithCart;

          // Loại bỏ thuộc tính systemVoucherCode nếu nó có giá trị rỗng

          if (systemVoucherCode === "") {
            updatedOrderRequest.systemVoucherCode = null;
          } else {
            updatedOrderRequest.systemVoucherCode = systemVoucherCode;
          }

          return updatedOrderRequest;
        }
      ),
    };
  };

  // Xử lý đặt hàng khi orderRequestWithCarts thay đổi và không đang cập nhật
  useEffect(() => {
    console.log("Order Request With Carts: ", orderRequestWithCarts);
    if (!orderRequestWithCarts || isUpdating) {
      return;
    }
    const handleUpdateOrder = async () => {
      if (!isUpdating) {
        setIsUpdating(true);
        try {
          const edittedOrderRequestWithCarts = trustedOrderRequestWithCarts(
            orderRequestWithCarts
          );
          const updateOrderResponse = await updateMultiOrder(
            edittedOrderRequestWithCarts
          ).unwrap();

          if (updateOrderResponse) {
            toast("🦄 Cập nhật đơn hàng thành công!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
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

    handleUpdateOrder();
  }, [orderRequestWithCarts]);
  // Hiển thị thông tin đơn hàng và xử lý thanh toán
  return (
    <>
      {isLoading || !address || !paymentMethod || !multipleOrderResponse ? (
        <div>
          Loading...{isLoading ? "true" : "false"} {paymentMethod}
        </div>
      ) : (
        <Order
          priceDataFromMultipleOrderResponse={multipleOrderResponse}
          address={address}
          systemVoucherNameAndId={systemVoucherNameAndId}
          paymentMethod={paymentMethod}
          updateOrderRequest={updateOrderRequest}
          handlePlaceOrder={() => {
            handlePlaceOrder(multipleOrderResponse);
          }}
        />
      )}
    </>
  );
};

// DATA OF RESPONSE
// Hàm lấy dữ liệu đơn hàng từ URL
const getMultipleOrderResponseFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = urlParams.get("state");
  if (!params) {
    return alert("Invalid state");
  }
  const encryptedState = decodeURIComponent(params);
  const decryptedState = AES.decrypt(
    encryptedState,
    "vtv-secret-key-2024"
  ).toString(enc.Utf8);
  // console.log("Decrypted State: ", decryptedState);
  return JSON.parse(decryptedState);
};

// Hàm lấy thông tin cần thiết từ đơn hàng
const getNeccessaryOrderResponses = (
  multipleOrderResponse: MultipleOrderResponse
) => {
  return multipleOrderResponse.orderResponses.map(
    ({ code, balance, totalPoint, orderDTO }) => ({
      code,
      balance,
      totalPoint,
      orderDTO,
    })
  );
};

// Hàm lấy tên và ID voucher hệ thống
const getSystemVoucherNameAndId = (orderDTO) => {
  const systemVoucher = orderDTO?.voucherOrderDTOs?.find(
    (voucher) => voucher.type
  );
  return systemVoucher
    ? { name: systemVoucher.voucherName, id: systemVoucher.voucherId }
    : undefined;
};

// Hàm lấy mã voucher hệ thống
const getSystemVoucherCode = async (orderDTO) => {
  const systemVoucher = orderDTO.voucherOrderDTOs?.find(
    (voucher) => voucher.type === false
  );
  const id = systemVoucher?.voucherId.toString() || "";
  if (id !== "" && id) {
    try {
      const data = await getVoucherByVoucherId(id);
      return data.voucherDTO.code;
    } catch (error) {
      alert("Failed to fetch vouchers");
    }
    //get code by call api
  }
  return undefined;
};

const getShopVoucherCode = async (orderDTO) => {
  const shopVoucher = orderDTO.voucherOrderDTOs?.find(
    (voucher) => voucher.type === true
  );
  const id = shopVoucher?.voucherId.toString() || "";
  if (id !== "" && id) {
    try {
      const data = await getVoucherByVoucherId(id);
      return data.voucherDTO.code;
    } catch (error) {
      alert("Failed to fetch vouchers");
    }
    //get code by call api
  }
  return undefined;
};

const updateURL = (orderResponsesWithCart: MultipleOrderResponse) => {
  const updatedStateString = JSON.stringify(orderResponsesWithCart);
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

const getMultipleOrderRequestWithCartFromMultipleOrderResponse = async (
  multipleOrderResponse: MultipleOrderResponse
) => {
  const orderRequestWithCarts = [];

  for (const orderResponse of multipleOrderResponse.orderResponses) {
    const { orderDTO } = orderResponse;
    const shopVoucherCode = await getShopVoucherCode(orderDTO);
    const systemVoucherCode = await getSystemVoucherCode(orderDTO);

    orderRequestWithCarts.push({
      addressId: orderDTO.addressDTO.addressId,
      systemVoucherCode: systemVoucherCode,
      shopVoucherCode: shopVoucherCode,
      paymentMethod: orderDTO.paymentMethod,
      shippingMethod: orderDTO.shippingMethod,
      note: orderDTO.note,
      useLoyaltyPoint: !!orderDTO.loyaltyPointHistoryDTO,
      cartIds: orderDTO.orderItemDTOs.map(({ cartId }) => cartId),
    });
  }

  return { orderRequestWithCarts };
};

//handle place order
const handlePlaceOrder = async (
  multipleOrderResponse: MultipleOrderResponse
) => {
  console.log(
    "Order Request With Carts: ",
    await getMultipleOrderRequestWithCartFromMultipleOrderResponse(
      multipleOrderResponse
    )
  );
};
