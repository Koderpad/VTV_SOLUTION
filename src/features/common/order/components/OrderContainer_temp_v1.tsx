// import {
//   Dispatch,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   useCreateOrderMutation,
//   useCreateUpdateOrderMutation,
//   useUpdateMultiOrderMutation,
// } from "../../../../redux/features/common/order/orderApiSlice";
// import { toast } from "react-toastify";
// import { Order } from "@/components/organisms/Order";
// import { AES, enc } from "crypto-js";
// import {
//   MultipleOrderResponse,
//   OrderResponse,
// } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
// import {
//   MultipleOrderRequestWithCart,
//   OrderRequestWithCart,
// } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
//
// export const OrderContainer = () => {
//   const navigate = useNavigate();
//   const [createOrder] = useCreateOrderMutation();
//   const [createUpdateOrder] = useCreateUpdateOrderMutation();
//   const [updateMultiOrder] = useUpdateMultiOrderMutation();
//
//   const [isUpdating, setIsUpdating] = useState(false);
//   const shouldUpdateFromURL = useRef(true);
//
//   // Lấy dữ liệu đơn hàng từ URL
//   const multipleOrderResponse: MultipleOrderResponse =
//     getMultipleOrderResponseFromURL();
//
//   if (multipleOrderResponse) {
//     console.log("Multi Order Res: ", multipleOrderResponse);
//   }
//
//   // Lấy thông tin cần thiết từ đơn hàng
//   const neccessaryOrderResponses = getNeccessaryOrderResponses(
//     multipleOrderResponse
//   );
//
//   console.log("Neccessary Order Res: ", neccessaryOrderResponses);
//
//   // Khởi tạo state cho thông tin đơn hàng và thanh toán
//   const [orderRequestWithCarts, setOrderRequestWithCarts] =
//     useState<MultipleOrderRequestWithCart>({ orderRequestWithCarts: [] });
//   const [address, setAddress] = useState(
//     neccessaryOrderResponses[0]?.orderDTO.addressDTO
//   );
//   const [systemVoucherNameAndId, setSystemVoucherNameAndId] = useState(
//     getSystemVoucherNameAndId(neccessaryOrderResponses[0])
//   );
//   const [paymentMethod, setPaymentMethod] = useState(
//     neccessaryOrderResponses[0]?.orderDTO.paymentMethod || "COD"
//   );
//   const [updatedOrderRequests, setUpdatedOrderRequests] = useState<
//     Partial<OrderRequestWithCart>[]
//   >(neccessaryOrderResponses.map(() => ({})));
//   const [reRender, setReRender] = useState(false);
//
//   // Hàm cập nhật thông tin đơn hàng khi người dùng thay đổi
//   const updateOrderRequest = (
//     index: number,
//     updates: Partial<OrderRequestWithCart>
//   ) => {
//     setUpdatedOrderRequests((prevUpdatedOrderRequests) => {
//       const newUpdatedOrderRequests = [...prevUpdatedOrderRequests];
//       if (index === -1) {
//         newUpdatedOrderRequests.forEach((order) =>
//           Object.assign(order, updates)
//         );
//       } else {
//         newUpdatedOrderRequests[index] = {
//           ...newUpdatedOrderRequests[index],
//           ...updates,
//         };
//       }
//       return newUpdatedOrderRequests;
//     });
//   };
//
//   // Cập nhật orderRequestWithCarts khi có thay đổi từ người dùng
//   useEffect(() => {
//     console.log("Updated Order Requests: ", updatedOrderRequests);
//     const updatedOrderRequestWithCarts: OrderRequestWithCart[] =
//       neccessaryOrderResponses.map((orderResponse, index) => {
//         const { orderDTO } = orderResponse;
//         const updates = updatedOrderRequests[index];
//         return {
//           addressId: orderDTO.addressDTO.addressId,
//           systemVoucherCode:
//             updates.systemVoucherCode || getSystemVoucherCode(orderDTO),
//           shopVoucherCode: updates.shopVoucherCode || undefined, // Fix: Assert that shopVoucherCode is always a string
//           paymentMethod: updates.paymentMethod || orderDTO.paymentMethod,
//           shippingMethod: updates.shippingMethod || orderDTO.shippingMethod,
//           note: updates.note || orderDTO.note || "",
//           useLoyaltyPoint:
//             updates.useLoyaltyPoint ||
//             (orderDTO.loyaltyPointHistoryDTO ? true : false),
//           cartIds: orderDTO.orderItemDTOs.map(({ cartId }) => cartId),
//         };
//       });
//
//     setOrderRequestWithCarts({
//       orderRequestWithCarts: updatedOrderRequestWithCarts,
//     });
//   }, [updatedOrderRequests]);
//
//   // Cập nhật dữ liệu từ URL
//   useEffect(() => {
//     if (shouldUpdateFromURL.current) {
//       const multipleOrderResponse: MultipleOrderResponse =
//         getMultipleOrderResponseFromURL();
//
//       const neccessaryOrderResponses = getNeccessaryOrderResponses(
//         multipleOrderResponse
//       );
//       setAddress(neccessaryOrderResponses[0]?.orderDTO.addressDTO);
//       setSystemVoucherNameAndId(
//         getSystemVoucherNameAndId(neccessaryOrderResponses[0])
//       );
//       setPaymentMethod(
//         neccessaryOrderResponses[0]?.orderDTO.paymentMethod || "COD"
//       );
//       setUpdatedOrderRequests(neccessaryOrderResponses.map(() => ({})));
//
//       shouldUpdateFromURL.current = false;
//     }
//   }, []);
//   // Xử lý đặt hàng khi orderRequestWithCarts thay đổi
//   const trustedOrderRequestWithCarts = () => {
//     return {
//       orderRequestWithCarts: orderRequestWithCarts.orderRequestWithCarts.map(
//         (orderRequestWithCart) => {
//           const { systemVoucherCode, shopVoucherCode, ...rest } =
//             orderRequestWithCart;
//
//           let updatedOrderRequest = orderRequestWithCart;
//
//           // Loại bỏ thuộc tính systemVoucherCode nếu nó có giá trị rỗng
//
//           if (systemVoucherCode === "") {
//             updatedOrderRequest.systemVoucherCode = null;
//           } else {
//             updatedOrderRequest.systemVoucherCode = systemVoucherCode;
//           }
//
//           return updatedOrderRequest;
//         }
//       ),
//     };
//   };
//
//   // Xử lý đặt hàng khi orderRequestWithCarts thay đổi và không đang cập nhật
//   useEffect(() => {
//     console.log("Order Request With Carts: ", orderRequestWithCarts);
//     const handleUpdateOrder = async () => {
//       if (!isUpdating) {
//         setIsUpdating(true);
//         try {
//           const edittedOrderRequestWithCarts = trustedOrderRequestWithCarts();
//           const updateOrderResponse = await updateMultiOrder(
//             edittedOrderRequestWithCarts
//           ).unwrap();
//
//           if (updateOrderResponse) {
//             toast.success("Cập nhật đơn hàng thành công");
//             updateURL(updateOrderResponse);
//             shouldUpdateFromURL.current = true;
//           } else {
//             toast.error("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau");
//           }
//         } catch (error) {
//           console.error("Lỗi khi đặt hàng:", error);
//           toast.error("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau");
//         }
//         setIsUpdating(false);
//       }
//     };
//
//     handleUpdateOrder();
//   }, [orderRequestWithCarts]);
//   // Hiển thị thông tin đơn hàng và xử lý thanh toán
//   return (
//     <Order
//       priceDataFromMultipleOrderResponse={multipleOrderResponse}
//       address={address}
//       systemVoucherNameAndId={systemVoucherNameAndId}
//       paymentMethod={paymentMethod}
//       updateOrderRequest={updateOrderRequest}
//     />
//   );
// };
//
// // DATA OF RESPONSE
// // Hàm lấy dữ liệu đơn hàng từ URL
// const getMultipleOrderResponseFromURL = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const params = urlParams.get("state");
//   if (!params) {
//     return alert("Invalid state");
//   }
//   const encryptedState = decodeURIComponent(params);
//   const decryptedState = AES.decrypt(
//     encryptedState,
//     "vtv-secret-key-2024"
//   ).toString(enc.Utf8);
//   // console.log("Decrypted State: ", decryptedState);
//   return JSON.parse(decryptedState);
// };
//
// // Hàm lấy thông tin cần thiết từ đơn hàng
// const getNeccessaryOrderResponses = (
//   multipleOrderResponse: MultipleOrderResponse
// ) => {
//   return multipleOrderResponse.orderResponses.map(
//     ({ code, balance, totalPoint, orderDTO }) => ({
//       code,
//       balance,
//       totalPoint,
//       orderDTO,
//     })
//   );
// };
//
// // Hàm lấy tên và ID voucher hệ thống
// const getSystemVoucherNameAndId = (orderDTO) => {
//   const systemVoucher = orderDTO?.voucherOrderDTOs?.find(
//     (voucher) => voucher.type
//   );
//   return systemVoucher
//     ? { name: systemVoucher.voucherName, id: systemVoucher.voucherId }
//     : null;
// };
//
// // Hàm lấy mã voucher hệ thống
// const getSystemVoucherCode = (orderDTO) => {
//   const systemVoucher = orderDTO.voucherOrderDTOs?.find(
//     (voucher) => voucher.type
//   );
//   console.log("System Voucher: ", systemVoucher);
//   return systemVoucher?.voucherId.toString() || "";
// };
//
// const updateURL = (orderResponsesWithCart: MultipleOrderResponse) => {
//   const updatedStateString = JSON.stringify(orderResponsesWithCart);
//   const encryptedUpdatedState = AES.encrypt(
//     updatedStateString,
//     "vtv-secret-key-2024"
//   ).toString();
//   const urlSafeEncryptedUpdatedState = encodeURIComponent(
//     encryptedUpdatedState
//   );
//   const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?state=${urlSafeEncryptedUpdatedState}`;
//   window.history.replaceState({}, "", newUrl);
// };
