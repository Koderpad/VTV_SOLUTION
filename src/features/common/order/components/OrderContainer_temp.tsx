// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
//
// import {
//   useCreateOrderMutation,
//   useCreateUpdateOrderMutation,
//   useSaveOrderMutation,
//   useUpdateMultiOrderMutation,
// } from "../../../../redux/features/common/order/orderApiSlice";
// import { useLocation } from "react-router-dom";
// // import {
// //   useGetVoucherByShopIdQuery,
// //   useGetVoucherSystemQuery,
// // } from "../../../../redux/features/voucher/voucherApiSlice";
// import { VoucherDTO } from "../interfaces/voucher";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import { AddressInfo } from "./AddressInfo";
// import { OrderDetails } from "./OrderDetails";
// import {
//   AddressDTO,
//   MultipleOrderResponse,
//   OrderItemDTO,
//   OrderResponse,
// } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
// import { Order } from "@/components/organisms/Order";
// import { AES, enc } from "crypto-js";
// import {
//   MultipleOrderRequestWithCart,
//   OrderRequestWithCart,
// } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
//
// export const OrderContainer = () => {
//   // new steps
//   //#region step 1: get multipleOrderResponse: MultiOrderResponse from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const params = urlParams.get("state");
//   if (params === null) {
//     return alert("Invalid state");
//   }
//   const encryptedState = decodeURIComponent(params);
//   const decryptedState = AES.decrypt(
//     encryptedState,
//     "vtv-secret-key-2024"
//   ).toString(enc.Utf8);
//   const multipleOrderResponse: MultipleOrderResponse =
//     JSON.parse(decryptedState);
//   //#endregion
//
//   //#region step 2: get neccessaryOrderResponses from multipleOrderResponse
//   const orderResponses: OrderResponse[] = multipleOrderResponse.orderResponses;
//   //get neccessary data from orderResponses
//   const neccessaryOrderResponses = orderResponses.map(
//     ({ code, balance, totalPoint, orderDTO }) => {
//       return {
//         code,
//         balance,
//         totalPoint,
//         orderDTO,
//       };
//     }
//   );
//   const [minimizeOrderResponses, setMinimizeOrderResponses] = useState<
//     OrderResponse[]
//   >([]);
//   //create a function to get data from orderResponses to neccessaryOrderResponses
//   const getDataForNeccessaryOrderResponses = () => {
//     const neccessaryOrderResponses = orderResponses.map(
//       ({ code, balance, totalPoint, orderDTO }) => {
//         return {
//           code,
//           balance,
//           totalPoint,
//           orderDTO,
//         };
//       }
//     );
//     return neccessaryOrderResponses;
//   };
//
//   //#endregion
//
//   //step 3: call API
//   // const priceDataFromMultipleOrderResponse: Omit<MultipleOrderResponse, ""> = {
//   //   status: multipleOrderResponse.status,
//   //   message: multipleOrderResponse.message,
//   //   code: multipleOrderResponse.code,
//   //   count: multipleOrderResponse.count,
//   //   totalProduct: multipleOrderResponse.totalProduct,
//   //   totalQuantity: multipleOrderResponse.totalQuantity,
//   //   totalPrice: multipleOrderResponse.totalPrice,
//   //   totalPayment: multipleOrderResponse.totalPayment,
//   //   totalDiscount: multipleOrderResponse.totalDiscount,
//   //   totalShippingFee: multipleOrderResponse.totalShippingFee,
//   //   totalLoyaltyPoint: multipleOrderResponse.totalLoyaltyPoint,
//   //   discountShop: multipleOrderResponse.discountShop,
//   //   discountSystem: multipleOrderResponse.discountSystem,
//   // };
//   const [updateMultiOrder] = useUpdateMultiOrderMutation();
//
//   //#region step 4: indicated shipping and payment
//   //payment values:- COD, VNPay, wallet
//   const enum PaymentMethod {
//     COD = "COD",
//     VNPay = "VNPay",
//     wallet = "wallet",
//   }
//
//   //shipping values:- VTV Express, GHN, GHTK
//   const enum ShippingMethod {
//     VTVExpress = "VTV Express",
//     GHN = "GHN",
//     GHTK = "GHTK",
//   }
//
//   const [shippingMethod, setShippingMethod] = useState<string>(
//     ShippingMethod.VTVExpress
//   );
//
//   // Function to handle payment method selection
//   const handlePaymentMethod = (method: PaymentMethod) => {
//     setPaymentMethod(method);
//   };
//
//   // Function to handle shipping method selection
//   const handleShippingMethod = (method: ShippingMethod) => {
//     setShippingMethod(method);
//   };
//   //#endregion
//
//   //#region step 5: generate a lot of variables to store updated data to reder in UI
//   const [orderRequestWithCarts, setOrderRequestWithCarts] =
//     useState<MultipleOrderRequestWithCart>({
//       orderRequestWithCarts: [],
//     });
//
//   //variables for rendering UI
//   const [address, setAddress] = useState<AddressDTO>();
//   const [systemVoucherNameAndId, setSystemVoucherNameAndId] = useState<{
//     name: string;
//     id: number;
//   } | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState<string>(PaymentMethod.COD);
//
//   //create a function: get data from neccessaryOrderResponses to match with orderRequestWithCarts
//   const getDataForOrderRequestWithCarts = () => {
//     const orderRequestWithCarts: OrderRequestWithCart[] =
//       neccessaryOrderResponses.map(
//         ({
//           orderDTO: {
//             note,
//             paymentMethod,
//             shippingMethod,
//             addressDTO,
//             loyaltyPointHistoryDTO,
//             orderItemDTOs,
//           },
//         }) => {
//           const cartIds = orderItemDTOs.map(({ cartId }) => cartId);
//
//           return {
//             addressId: addressDTO.addressId,
//             systemVoucherCode: "", // Correct property name
//             shopVoucherCode: "", // Correct property name
//             paymentMethod,
//             shippingMethod,
//             note,
//             useLoyaltyPoint: loyaltyPointHistoryDTO ? true : false,
//             cartIds,
//           };
//         }
//       );
//
//     setOrderRequestWithCarts({ orderRequestWithCarts });
//   };
//
//   //#endregion
//
//   //#region step 6: create variables to store changed data when user interact with UI
//   const [updatedOrderRequests, setUpdatedOrderRequests] = useState<
//     Partial<OrderRequestWithCart>[]
//   >(neccessaryOrderResponses.map(() => ({})));
//
//   const updateOrderRequest = (
//     index: number,
//     updates: Partial<OrderRequestWithCart>
//   ) => {
//     if (index === -1) {
//       setUpdatedOrderRequests((prevUpdatedOrderRequests) => {
//         const newUpdatedOrderRequests = prevUpdatedOrderRequests.map(
//           (updatedOrderRequest) => ({
//             ...updatedOrderRequest,
//             ...updates,
//           })
//         );
//         return newUpdatedOrderRequests;
//       });
//     } else {
//       setUpdatedOrderRequests((prevUpdatedOrderRequests) => {
//         const newUpdatedOrderRequests = [...prevUpdatedOrderRequests];
//         newUpdatedOrderRequests[index] = {
//           ...newUpdatedOrderRequests[index],
//           ...updates,
//         };
//         return newUpdatedOrderRequests;
//       });
//     }
//   };
//   //this function is used to update the payment method
//   const handleUpdateOrderRequest = () => {
//     const updatedOrderRequestWithCarts: OrderRequestWithCart[] =
//       neccessaryOrderResponses.map((orderResponse, index) => {
//         const { orderDTO } = orderResponse;
//         const updates = updatedOrderRequests[index];
//         return {
//           addressId: orderDTO.addressDTO.addressId,
//           systemVoucherCode:
//             updates.systemVoucherCode ||
//             orderDTO.voucherOrderDTOs
//               ?.find((voucher) => voucher.type == true)
//               ?.voucherId.toString() ||
//             "",
//           shopVoucherCode: updates.shopVoucherCode || null,
//           paymentMethod: updates.paymentMethod || orderDTO.paymentMethod,
//           shippingMethod: updates.shippingMethod || orderDTO.shippingMethod,
//           note: updates.note || orderDTO.note || "",
//           useLoyaltyPoint:
//             updates.useLoyaltyPoint || orderDTO.loyaltyPointHistoryDTO
//               ? true
//               : false,
//           cartIds: orderDTO.orderItemDTOs.map(({ cartId }) => cartId),
//         };
//       });
//
//     setOrderRequestWithCarts({
//       orderRequestWithCarts: updatedOrderRequestWithCarts,
//     });
//
//     // Gửi yêu cầu thanh toán với orderRequestWithCarts đã cập nhật
//   };
//
//   useEffect(() => {
//     handleUpdateOrderRequest();
//   }, [updatedOrderRequests]);
//   //#endregion
//
//   useEffect(() => {
//     if (neccessaryOrderResponses.length > 0) {
//       setAddress(neccessaryOrderResponses[0].orderDTO.addressDTO);
//       setSystemVoucherNameAndId(() => {
//         const voucher =
//           neccessaryOrderResponses[0].orderDTO.voucherOrderDTOs?.find(
//             (voucher) => (voucher.type ? "system" : "shop")
//           );
//         return voucher
//           ? { name: voucher.voucherName, id: voucher.voucherId }
//           : null;
//       });
//       setPaymentMethod(
//         neccessaryOrderResponses[0].orderDTO.paymentMethod || PaymentMethod.COD
//       );
//     }
//     getDataForOrderRequestWithCarts();
//   }, []);
//
//   useEffect(() => {
//     //handle update order
//     const handleUpdateOrder = async () => {
//       try {
//         // Gọi API để đặt hàng
//         const updateOrderResponse = await updateMultiOrder(
//           orderRequestWithCarts
//         ).unwrap();
//
//         // Kiểm tra kết quả trả về từ API
//         if (updateOrderResponse) {
//           // Nếu thành công, hiển thị thông báo
//           toast.success("Cập nhật đơn hàng thành công");
//
//           const updatedStateString = JSON.stringify(orderRequestWithCarts);
//           const encryptedUpdatedState = CryptoJS.AES.encrypt(
//             updatedStateString,
//             "vtv-secret-key-2024"
//           ).toString();
//           const urlSafeEncryptedUpdatedState = encodeURIComponent(
//             encryptedUpdatedState
//           );
//
//           const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?state=${urlSafeEncryptedUpdatedState}`;
//           window.history.replaceState({}, "", newUrl);
//
//           // Chuyển hướng về trang chi tiết đơn hàng
//           // navigate(`/order/${data.orderId}`);
//         } else {
//           // Nếu không thành công, hiển thị thông báo lỗi
//           toast.error("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau");
//         }
//       } catch (error) {
//         // Xử lý lỗi nếu có
//         console.error("Lỗi khi đặt hàng:", error);
//         toast.error("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau");
//       }
//     };
//     console.log("orderRequestWithCarts", orderRequestWithCarts);
//     handleUpdateOrder();
//   }, [orderRequestWithCarts]);
//
//   //
//   //#region step error: handle error
//   if (neccessaryOrderResponses.length === 0) {
//     return;
//   }
//
//   // if (systemVoucherNameAndId === null || systemVoucherNameAndId === undefined) {
//   //   return "Loading...";
//   // }
//   if (address === null || address === undefined) {
//     return "Loading...";
//   }
//   //#endregion
//
//   // old
//
//   // const [selectedVouchersOfSystem, setSelectedVouchersOfSystem] = useState<
//   //   number[]
//   // >([]);
//
//   // const [saveOrder] = useSaveOrderMutation();
//   // const [createUpdateOrder] = useCreateUpdateOrderMutation();
//
//   // const navigate = useNavigate();
//   // const [showVoucherForm, setShowVoucherForm] = useState(false);
//   // const [showSystemVoucherForm, setShowSystemVoucherForm] = useState(false);
//
//   // Sử dụng hook để lấy danh sách voucher của hệ thống
//   // const { data: systemVouchers } = useGetVoucherSystemQuery("system");
//
//   // Sử dụng các interface để đảm bảo kiểu dữ liệu
//   // const systemFromVouchers: VoucherDTO[] | undefined =
//   //   systemVouchers?.voucherDTOs;
//
//   // const handleVouchersOfSystem = (voucherId: number) => {
//   //   // Kiểm tra xem voucher đã được chọn chưa
//   //   if (selectedVouchersOfSystem.includes(voucherId)) {
//   //     // Nếu đã chọn, loại bỏ khỏi danh sách
//   //     setSelectedVouchersOfSystem(
//   //       selectedVouchersOfSystem.filter((id) => id !== voucherId)
//   //     );
//   //   } else {
//   //     // Nếu chưa chọn, thêm vào danh sách
//   //     setSelectedVouchersOfSystem([...selectedVouchersOfSystem, voucherId]);
//   //   }
//   // };
//
//   // const handleToggleVoucherForm = () => {
//   //   setShowVoucherForm(!showVoucherForm);
//   // };
//
//   // const handlePlaceOrder = async () => {};
//
//   // const formatPrice = (price: number) => {
//   //   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   // };
//
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
