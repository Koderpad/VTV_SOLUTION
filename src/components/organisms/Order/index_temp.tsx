// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
//
// import {
//   useCreateUpdateOrderMutation,
//   useSaveOrderMutation,
// } from "../../redux/api/orderApi";
// import { useLocation } from "react-router-dom";
// import {
//   useGetVoucherByShopIdQuery,
//   useGetVoucherSystemQuery,
// } from "../../redux/api/voucherApi";
// import { VoucherDTO } from "../interfaces/voucher";
//
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import { AddressInfo } from "./AddressInfo";
// import { OrderDetails } from "./OrdersFromAShop";
// import {
//   AddressDTO,
//   OrderItemDTO,
// } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
//
// interface OrderDTO {
//   orderId: number | null;
//   note: string | null;
//   paymentMethod: string;
//   shippingMethod: string;
//   count: number;
//   shopId: number;
//   shopName: string;
//   totalPrice: number;
//   discount: number;
//   shippingFee: number;
//   paymentTotal: number;
//   status: string;
//   addressDTO: AddressDTO;
//   voucherOrderDTOs: VoucherOrderDTO[] | null;
//   orderItemDTOs: OrderItemDTO[];
//   orderDate: string;
// }
//
// interface ApiResponse {
//   status: string;
//   message: string;
//   code: number;
//   username: string;
//   orderDTO: OrderDTO;
// }
//
// function PayMentForm() {
//   const [orderDetails, setOrderDetails] = useState<OrderItemDTO | null>(null);
//   const [address, setAddress] = useState<AddressDTO | null>(null);
//   const [selectedVouchersOfShop, setSelectedVouchersOfShop] = useState<
//     number[]
//   >([]);
//
//   const [selectedVouchersOfSystem, setSelectedVouchersOfSystem] = useState<
//     number[]
//   >([]);
//
//   const [saveOrder] = useSaveOrderMutation();
//   const [createUpdateOrder] = useCreateUpdateOrderMutation();
//
//   const navigate = useNavigate();
//   const [showVoucherForm, setShowVoucherForm] = useState(false);
//   const [showSystemVoucherForm, setShowSystemVoucherForm] = useState(false);
//   const location = useLocation();
//
//   // Sử dụng hook để lấy danh sách voucher của hệ thống
//   const { data: systemVouchers } = useGetVoucherSystemQuery("system");
//
//   // Sử dụng các interface để đảm bảo kiểu dữ liệu
//   const systemFromVouchers: VoucherDTO[] | undefined =
//     systemVouchers?.voucherDTOs;
//
//   const res: ApiResponse = location.state.res.data;
//   console.log("res of order: ", res);
//   if (!res) alert("Không ton tai thông tin cart!!!");
//
//   const { data: shopVouchers } = useGetVoucherByShopIdQuery(
//     res && res.orderDTO && res.orderDTO.shopId ? res.orderDTO.shopId : 0
//   );
//
//   const handleVouchersOfSystem = (voucherId: number) => {
//     // Kiểm tra xem voucher đã được chọn chưa
//     if (selectedVouchersOfSystem.includes(voucherId)) {
//       // Nếu đã chọn, loại bỏ khỏi danh sách
//       setSelectedVouchersOfSystem(
//         selectedVouchersOfSystem.filter((id) => id !== voucherId)
//       );
//     } else {
//       // Nếu chưa chọn, thêm vào danh sách
//       setSelectedVouchersOfSystem([...selectedVouchersOfSystem, voucherId]);
//     }
//   };
//
//   const shopFromVoucher: VoucherDTO[] | undefined = shopVouchers?.voucherDTOs;
//
//   useEffect(() => {
//     if (res) {
//       // console.log("res", res.orderDTO);
//       setOrderDetails(res.orderDTO);
//       setAddress(res.orderDTO?.addressDTO);
//     }
//   }, [res]);
//
//   const [updateOrderResponse, setUpdateOrderResponse] = useState<ApiResponse>();
//
//   useEffect(() => {
//     console.log("res in effect: ", res);
//     if (res) {
//       const fetchData = async () => {
//         // Your async code here...
//         const cartIds =
//           res.orderDTO?.orderItemDTOs.map((item) => item.cartId) || [];
//
//         const data = {
//           cartIds: cartIds,
//           addressId: address?.addressId || 0,
//           note: orderDetails?.note || "",
//           voucherShopId: selectedVouchersOfShop[0] || null,
//           voucherSystemId: selectedVouchersOfSystem[0] || null,
//           paymentMethod: orderDetails?.paymentMethod || "",
//           shippingMethod: orderDetails?.shippingMethod || "",
//         };
//
//         console.log("Update Order API Data: ", data);
//
//         // Make the API call to update order information
//         const response = await createUpdateOrder(data);
//
//         if (response) {
//           // Lưu giữ dữ liệu từ API response trong state
//
//           console.log(
//             "Update Order API Response:Update Order API Response:",
//             response?.data
//           );
//
//           setUpdateOrderResponse(response?.data);
//         }
//         // Lưu giữ dữ liệu từ API response trong state
//
//         // Handle the response as needed
//         console.log("Update Order API Response:", response?.data);
//       };
//       fetchData();
//     }
//   }, [
//     address,
//     selectedVouchersOfSystem,
//     selectedVouchersOfShop,
//     orderDetails,
//     createUpdateOrder,
//     res,
//   ]);
//
//   const handleToggleVoucherForm = () => {
//     setShowVoucherForm(!showVoucherForm);
//   };
//
//   const handlePlaceOrder = async () => {
//     const cartIds =
//       orderDetails?.orderItemDTOs.map((item) => item.cartId) || [];
//
//     const data = {
//       cartIds: cartIds,
//       addressId: address?.addressId || 0,
//       note: orderDetails?.note || "",
//       voucherShopId: selectedVouchersOfShop[0] || null,
//       voucherSystemId: selectedVouchersOfSystem[0] || null,
//       paymentMethod: "COD",
//       shippingMethod: shippingMethod || "",
//     };
//
//     console.log("Save Order API Data: ", data);
//
//     try {
//       if (shippingMethod === "") {
//         toast.error("Vui lòng chọn phương thức vận chuyển!", {
//           position: "top-right",
//           autoClose: 3000, // Thời gian hiển thị thông báo (ms)
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         return;
//       }
//       // Thực hiện gọi API để lưu đơn hàng
//       const response = await saveOrder(data);
//
//       if (response) {
//         // Xử lý response theo cần thiết
//         console.log("Save Order API Response:", response.data);
//
//         const orderId: number | undefined | null =
//           response?.data?.orderDTO.orderId;
//
//         // Hiển thị thông báo thành công
//         toast.success(`Đơn hàng đã được đặt thành công!`, {
//           position: "top-right",
//           autoClose: 1000, // Thời gian hiển thị thông báo (ms)
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           onClose: () => {
//             navigate("/user/account/history-purchase?status=1");
//           },
//         });
//
//         if (orderId) {
//           // navigate(`/order-details/${orderId}`);
//         }
//       }
//     } catch (error) {
//       console.error("Save Order API Error:", error);
//
//       // Hiển thị thông báo lỗi
//       toast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };
//
//   const formatPrice = (price: number) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };
//
//   return (
//     <>
//       <div className="bg-gray">
//         {/* shop label */}
//         <div className="flex bg-white h-full w-full py-8 mt-44 items-center">
//           {/* Image */}
//           <img
//             src="/logo_border.png"
//             alt="Description of the image"
//             className="mr-8 ml-4"
//             style={{ width: "50px", height: "50px" }}
//           />
//
//           <div className="flex items-center">
//             <span className="whitespace-nowrap">VTC</span>
//
//             <div className="h-10 w-1 bg-black ml-4"></div>
//             <span className="whitespace-nowrap ml-4">Thanh Toán</span>
//           </div>
//         </div>
//
//         {/* address */}
//         <div className="w-4/5 mx-auto mt-12 bg-white flex flex-col h-auto rounded-md">
//           {address && <AddressInfo address={address} />}
//         </div>
//
//         {/* item */}
//         <OrderDetails
//           orderDetails={orderDetails}
//           shopFromVoucher={shopFromVoucher || []}
//           formatPrice={formatPrice}
//         />
//
//         <div className="w-4/5 mx-auto mt-4 bg-white flex flex-col">
//           <div className="bg-white flex flex-col shadow-md rounded px-8 py-6 mb-4">
//             {/* transf method */}
//
//             {/* payment method */}
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Phương thức thanh toán
//               </span>
//               <span className="text-gray-700 text-2xl font-medium ml-auto">
//                 Thanh Toán khi nhận hàng (COD)
//               </span>
//             </div>
//             <div className="border-t my-4 border-black-200"></div>
//
//             {/* price */}
//             <div className="flex flex-col  rounded px-8 py-6 mb-4">
//               {/* Existing content */}
//               <div className="bg-white flex justify-between mb-4">
//                 <span className="text-gray-700 text-2xl font-medium">
//                   Tổng tiền hàng
//                 </span>
//                 <span className="text-gray-700 text-2xl font-medium">
//                   {updateOrderResponse &&
//                     formatPrice(updateOrderResponse.orderDTO.totalPrice)}{" "}
//                   VNĐ
//                 </span>
//               </div>
//               {/* Tiền vận chuyển Section */}
//               <div className="bg-white flex justify-between mb-4">
//                 <span className="text-gray-700 text-2xl font-medium">
//                   Tiền giảm voucher
//                 </span>
//                 <span className="text-red-500 text-2xl font-medium">
//                   -
//                   {updateOrderResponse &&
//                     formatPrice(updateOrderResponse.orderDTO.discount)}{" "}
//                   VNĐ
//                 </span>
//               </div>
//               {/* Tiền vận chuyển Section */}
//               <div className="bg-white flex justify-between mb-4">
//                 <span className="text-gray-700 text-2xl font-medium">
//                   Phí vận chuyển
//                 </span>
//                 <span className="text-gray-700 text-2xl font-medium">
//                   {updateOrderResponse &&
//                     formatPrice(updateOrderResponse.orderDTO.shippingFee)}{" "}
//                   VNĐ
//                 </span>
//               </div>
//               <div className="border-t my-4 border-black-200"></div>
//               {/* Tổng tiền Section */}
//               <div className="bg-white flex justify-between mb-4">
//                 <span className="text-gray-700 text-2xl font-medium">
//                   Tổng tiền
//                 </span>
//                 <span className="text-gray-700 text-2xl font-medium">
//                   {updateOrderResponse &&
//                     formatPrice(updateOrderResponse.orderDTO.paymentTotal)}{" "}
//                   VNĐ
//                 </span>
//               </div>
//             </div>
//
//             <div className="border-t my-4 border-black-200"></div>
//
//             {/* dat hang */}
//             <div className="w-4/5 mx-auto mb-8 flex justify-end">
//               <button
//                 onClick={handlePlaceOrder}
//                 className="bg-blue-500 hover:bg-blue-800 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 type="button"
//               >
//                 Đặt hàng
//               </button>
//             </div>
//             <ToastContainer />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
//
// export default PayMentForm;
