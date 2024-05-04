import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateOrderMutation,
  useCreateUpdateOrderMutation,
  useSaveOrderMutation,
} from "../../../../redux/features/order/orderApiSlice";
import { useLocation } from "react-router-dom";
// import {
//   useGetVoucherByShopIdQuery,
//   useGetVoucherSystemQuery,
// } from "../../../../redux/features/voucher/voucherApiSlice";
import { VoucherDTO } from "../interfaces/voucher";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { AddressInfo } from "./AddressInfo";
import { OrderDetails } from "./OrderDetails";
import {
  AddressDTO,
  MultipleOrderResponse,
  OrderItemDTO,
  OrderResponse,
} from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
import { Order } from "@/components/organisms/Order";
import { AES, enc } from "crypto-js";
import {
  MultipleOrderRequestWithCart,
  OrderRequestWithCart,
} from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
import { use } from "chai";

export const OrderContainer = () => {
  // new steps
  //#region step 1: get multipleOrderResponse: MultiOrderResponse from URL
  const urlParams = new URLSearchParams(window.location.search);
  const params = urlParams.get("state");
  if (params === null) {
    return alert("Invalid state");
  }
  const encryptedState = decodeURIComponent(params);
  const decryptedState = AES.decrypt(
    encryptedState,
    "vtv-secret-key-2024"
  ).toString(enc.Utf8);
  const multipleOrderResponse: MultipleOrderResponse =
    JSON.parse(decryptedState);
  const data_type_string = JSON.stringify(multipleOrderResponse);
  //#endregion

  //#region step 2: get neccessaryOrderResponses from multipleOrderResponse
  const orderResponses: OrderResponse[] = multipleOrderResponse.orderResponses;
  //get neccessary data from orderResponses
  const neccessaryOrderResponses = orderResponses.map(
    ({ code, balance, totalPoint, orderDTO }) => {
      return {
        code,
        balance,
        totalPoint,
        orderDTO,
      };
    }
  );
  //#endregion

  //step 3: get data children from neccessaryOrderResponses
  // const addressDTOs = neccessaryOrderResponses.map(
  //   ({ orderDTO: { addressDTO } }) => {
  //     return addressDTO;
  //   }
  // );
  // const addressDTO = addressDTOs[0];

  //#region step 4: indicated shipping and payment
  //payment values:- COD, VNPay, wallet
  const enum PaymentMethod {
    COD = "COD",
    VNPay = "VNPay",
    wallet = "wallet",
  }

  //shipping values:- VTV Express, GHN, GHTK
  const enum ShippingMethod {
    VTVExpress = "VTV Express",
    GHN = "GHN",
    GHTK = "GHTK",
  }

  const [shippingMethod, setShippingMethod] = useState<string>(
    ShippingMethod.VTVExpress
  );

  // Function to handle payment method selection
  const handlePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Function to handle shipping method selection
  const handleShippingMethod = (method: ShippingMethod) => {
    setShippingMethod(method);
  };
  //#endregion

  //#region step 5: generate a lot of variables to store updated data to reder in UI
  const [orderRequestWithCarts, setOrderRequestWithCarts] =
    useState<MultipleOrderRequestWithCart>({
      orderRequestWithCarts: [],
    });

  const [addressId, setAddressId] = useState<number>(0);
  const [systemVoucherCode, setSystemVoucherCode] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PaymentMethod.COD);

  //create a function: get data from neccessaryOrderResponses to match with orderRequestWithCarts
  const getDataForOrderRequestWithCarts = () => {
    const orderRequestWithCarts: OrderRequestWithCart[] =
      neccessaryOrderResponses.map(
        ({
          orderDTO: {
            note,
            paymentMethod,
            shippingMethod,
            addressDTO,
            loyaltyPointHistoryDTO,
            orderItemDTOs,
          },
        }) => {
          const cartIds = orderItemDTOs.map(({ cartId }) => cartId);

          return {
            addressId: addressDTO.addressId,
            systemVoucherCode: "", // Correct property name
            shopVoucherCode: "", // Correct property name
            paymentMethod,
            shippingMethod,
            note,
            useLoyaltyPoint: loyaltyPointHistoryDTO ? true : false,
            cartIds,
          };
        }
      );

    setOrderRequestWithCarts({ orderRequestWithCarts });
  };

  useEffect(() => {
    getDataForOrderRequestWithCarts();
  }, []);

  useEffect(() => {
    if (orderRequestWithCarts.orderRequestWithCarts.length > 0) {
      setAddressId(orderRequestWithCarts.orderRequestWithCarts[0].addressId);
      setSystemVoucherCode(
        orderRequestWithCarts.orderRequestWithCarts[0].systemVoucherCode
      );
      setPaymentMethod(
        orderRequestWithCarts.orderRequestWithCarts[0].paymentMethod
      );
    }
  }, [orderRequestWithCarts]);
  //#endregion

  //#region step 6: create variables to store changed data when user interact with UI
  const [updatedOrderRequests, setUpdatedOrderRequests] = useState<
    Partial<OrderRequestWithCart>[]
  >(neccessaryOrderResponses.map(() => ({})));

  const updateOrderRequest = (
    index: number,
    updates: Partial<OrderRequestWithCart>
  ) => {
    setUpdatedOrderRequests((prevUpdatedOrderRequests) => {
      const newUpdatedOrderRequests = [...prevUpdatedOrderRequests];
      newUpdatedOrderRequests[index] = {
        ...newUpdatedOrderRequests[index],
        ...updates,
      };
      return newUpdatedOrderRequests;
    });
  };
  //this function is used to update the payment method
  const handleUpdateOrderRequest = () => {
    const updatedOrderRequestWithCarts: OrderRequestWithCart[] =
      neccessaryOrderResponses.map((orderResponse, index) => {
        const { orderDTO } = orderResponse;
        const updates = updatedOrderRequests[index];
        return {
          addressId: orderDTO.addressDTO.addressId,
          systemVoucherCode: updates.systemVoucherCode || "",
          shopVoucherCode: updates.shopVoucherCode || "",
          paymentMethod: updates.paymentMethod || orderDTO.paymentMethod,
          shippingMethod: updates.shippingMethod || orderDTO.shippingMethod,
          note: updates.note || orderDTO.note,
          useLoyaltyPoint:
            updates.useLoyaltyPoint || orderDTO.loyaltyPointHistoryDTO
              ? true
              : false,
          cartIds: orderDTO.orderItemDTOs.map(({ cartId }) => cartId),
        };
      });

    setOrderRequestWithCarts({
      orderRequestWithCarts: updatedOrderRequestWithCarts,
    });

    // Gửi yêu cầu thanh toán với orderRequestWithCarts đã cập nhật
  };
  //#endregion

  // old

  // const [selectedVouchersOfSystem, setSelectedVouchersOfSystem] = useState<
  //   number[]
  // >([]);

  // const [saveOrder] = useSaveOrderMutation();
  // const [createUpdateOrder] = useCreateUpdateOrderMutation();

  // const navigate = useNavigate();
  // const [showVoucherForm, setShowVoucherForm] = useState(false);
  // const [showSystemVoucherForm, setShowSystemVoucherForm] = useState(false);

  // Sử dụng hook để lấy danh sách voucher của hệ thống
  // const { data: systemVouchers } = useGetVoucherSystemQuery("system");

  // Sử dụng các interface để đảm bảo kiểu dữ liệu
  // const systemFromVouchers: VoucherDTO[] | undefined =
  //   systemVouchers?.voucherDTOs;

  // const handleVouchersOfSystem = (voucherId: number) => {
  //   // Kiểm tra xem voucher đã được chọn chưa
  //   if (selectedVouchersOfSystem.includes(voucherId)) {
  //     // Nếu đã chọn, loại bỏ khỏi danh sách
  //     setSelectedVouchersOfSystem(
  //       selectedVouchersOfSystem.filter((id) => id !== voucherId)
  //     );
  //   } else {
  //     // Nếu chưa chọn, thêm vào danh sách
  //     setSelectedVouchersOfSystem([...selectedVouchersOfSystem, voucherId]);
  //   }
  // };

  // const handleToggleVoucherForm = () => {
  //   setShowVoucherForm(!showVoucherForm);
  // };

  // const handlePlaceOrder = async () => {};

  // const formatPrice = (price: number) => {
  //   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  // };

  return <h1>{data_type_string}</h1>;
};
