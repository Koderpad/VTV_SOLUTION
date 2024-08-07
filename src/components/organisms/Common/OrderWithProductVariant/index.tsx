import {
  AddressDTO,
  OrderResponse,
} from "@/utils/DTOs/common/Order/Response/OrderResponse";
import { FC, useEffect, useState } from "react";
import { AddressInfo } from "./AddressInfo";
import { ToastContainer } from "react-toastify";
import Vouchers from "./Voucher/vouchers";
import VoucherDetails from "./Voucher/VoucherDetails";
import { OrderRequestWithProductVariant } from "@/utils/DTOs/common/Order/Request/OrderRequestWithProductVariant";
import { useSystemVoucher } from "@/hooks/useSystemVoucher";
import { OrderFromShop } from "@/components/organisms/Common/OrderWithProductVariant/OrdersFromAShop";

interface OrderProps {
  priceDataFromOrderResponse: OrderResponse;
  address: AddressDTO;
  systemVoucherNameAndId?: {
    name: string;
    id: number;
  } | null;
  paymentMethod: string;
  updateOrderRequest: (
    updates: Partial<OrderRequestWithProductVariant>
  ) => void;
  handlePlaceOrder: () => void;
}

export const Order: FC<OrderProps> = ({ ...props }) => {
  const { systemVouchers, isLoading, error } = useSystemVoucher();
  const [selectedSystemVoucher, setSelectedSystemVoucher] = useState<{
    id: number;
    code: string;
  } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    props.paymentMethod
  );
  const [usePoints, setUsePoints] = useState<boolean>(
    !!props.priceDataFromOrderResponse.orderDTO.loyaltyPointHistoryDTO
  );

  useEffect(() => {
    if (props.systemVoucherNameAndId) {
      setSelectedSystemVoucher({
        id: props.systemVoucherNameAndId.id,
        code: props.systemVoucherNameAndId.name,
      });
    }
  }, [props.systemVoucherNameAndId]);

  const handleVouchersOfSystem = (
    voucherId: number,
    voucherCode: string
  ): void => {
    if (selectedSystemVoucher?.id === voucherId) {
      setSelectedSystemVoucher(null);
      props.updateOrderRequest({ systemVoucherCode: "CANCEL" });
    } else {
      setSelectedSystemVoucher({ id: voucherId, code: voucherCode });
      props.updateOrderRequest({ systemVoucherCode: voucherCode });
    }
  };

  const handlePaymentMethod = (paymentMethod: string): void => {
    setSelectedPaymentMethod(paymentMethod);
    props.updateOrderRequest({ paymentMethod });
  };

  useEffect(() => {
    props.updateOrderRequest({ useLoyaltyPoint: usePoints });
  }, [usePoints]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) {
    return <div>Loading System Voucher...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="h-auto ">
        <AddressInfo
          address={props.address}
          updateOrderRequest={props.updateOrderRequest}
        />
      </div>

      <OrderFromShop
        order={props.priceDataFromOrderResponse}
        updateOrderRequest={props.updateOrderRequest}
        formatPrice={formatPrice}
      />

      <div className="my-4 bg-white flex flex-col">
        <div className="flex flex-col shadow-md rounded px-8 py-6">
          {/* LoyaltyPoint */}
          <div className="bg-white flex justify-between mb-4">
            <span className="text-gray-700 text-2xl font-medium">
              Điểm tích lũy
            </span>

            <label className="inline-flex items-center cursor-pointer">
              <span className="ms-3 text-sm pr-4 font-medium text-red-900 dark:text-gray-300">
                Điểm tích lũy: {props.priceDataFromOrderResponse.totalPoint}
              </span>
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                disabled={props.priceDataFromOrderResponse.totalPoint === 0}
                checked={usePoints}
                onChange={() => setUsePoints(!usePoints)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* payment method */}
          <div className="bg-white flex justify-between mb-4">
            <span className="text-gray-700 text-2xl font-medium">
              Phương thức thanh toán
            </span>
            <select
              className="border border-gray-300 rounded-md w-auto"
              value={selectedPaymentMethod}
              onChange={(e) => handlePaymentMethod(e.target.value)}
            >
              <option value="COD">Thanh toán khi nhận hàng</option>
              <option value="VNPay">Thanh toán qua VNPay</option>
              <option value="Wallet">Thanh toán qua ví</option>
            </select>
          </div>
          {selectedPaymentMethod === "Wallet" && (
            <div className="flex justify-between">
              <span className="text-gray-700 text-2xl font-medium">
                Số dư ví
              </span>
              <span className="text-red-600">
                {props.priceDataFromOrderResponse.balance}
              </span>
            </div>
          )}
          <div className="border-t my-4 border-black-200"></div>

          {/* system voucher */}
          <div className="bg-white flex justify-between mb-4">
            <span className="text-gray-700 text-2xl font-medium">
              Voucher hệ thống
            </span>
            <span className="text-gray-700 text-2xl font-medium ml-auto">
              {selectedSystemVoucher
                ? selectedSystemVoucher.code
                : "Không có voucher"}
            </span>
          </div>

          {/* sys voucher */}
          <div className="flex justify-between px-4 items-center mb-4">
            <div className="flex items-center">
              <img
                src="/public/voucher.png"
                alt="Voucher Icon"
                className="mr-2"
                style={{ width: "30px", height: "28px" }}
              />
              <span className="text-red-500">Voucher VTC</span>
            </div>

            <Vouchers
              key={selectedSystemVoucher?.id || -1}
              vouchers={systemVouchers}
              onClose={() => {}}
              onVoucherSelect_fix={handleVouchersOfSystem}
              selectedVouchers={
                selectedSystemVoucher ? [selectedSystemVoucher.id] : []
              }
            />
          </div>

          {selectedSystemVoucher && systemVouchers && (
            <VoucherDetails
              voucher={
                systemVouchers.find(
                  (v) => v.voucherId === selectedSystemVoucher.id
                )!
              }
            />
          )}
          <div className="border-t my-4 border-black-200"></div>

          {/* price */}
          <div className="flex flex-col rounded px-8 py-6 mb-4">
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Tổng tiền hàng
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(
                  props.priceDataFromOrderResponse.orderDTO.totalPrice
                )}
              </span>
            </div>
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Tiền giảm voucher
              </span>
              <span className="text-red-500 text-2xl font-medium">
                {formatPrice(
                  props.priceDataFromOrderResponse.orderDTO.discountShop +
                    props.priceDataFromOrderResponse.orderDTO.discountSystem
                )}{" "}
              </span>
            </div>
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Phí vận chuyển
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(
                  props.priceDataFromOrderResponse.orderDTO.shippingFee
                )}{" "}
              </span>
            </div>
            <div className="border-t my-4 border-black-200"></div>
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Tổng tiền
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(
                  props.priceDataFromOrderResponse.orderDTO.paymentTotal
                )}
              </span>
            </div>
          </div>

          <div className="border-t my-4 border-black-200"></div>

          {/* dat hang */}
          <div className="w-4/5 mx-auto mb-8 flex justify-end">
            <button
              onClick={props.handlePlaceOrder}
              className={`bg-blue-500 hover:bg-blue-800 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                props.priceDataFromOrderResponse.balance === 0 &&
                selectedPaymentMethod === "Wallet"
                  ? "bg-gray-600 cursor-not-allowed"
                  : ""
              }`}
              type="button"
              disabled={
                props.priceDataFromOrderResponse.balance === 0 &&
                selectedPaymentMethod === "Wallet"
              }
            >
              {props.priceDataFromOrderResponse.balance === 0 &&
              selectedPaymentMethod === "Wallet"
                ? "Số dư ví không đủ"
                : "Đặt hàng"}
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

// import {
//   AddressDTO,
//   OrderResponse,
// } from "@/utils/DTOs/common/Order/Response/OrderResponse";
// import { FC, useEffect, useMemo, useState } from "react";
// import { AddressInfo } from "./AddressInfo";
// import { ToastContainer } from "react-toastify";
// import Vouchers from "./Voucher/vouchers";
// import VoucherDetails from "./Voucher/VoucherDetails";
// import { OrderRequestWithProductVariant } from "@/utils/DTOs/common/Order/Request/OrderRequestWithProductVariant";
// import { useSystemVoucher } from "@/hooks/useSystemVoucher";
// import { OrderFromShop } from "@/components/organisms/Common/OrderWithProductVariant/OrdersFromAShop";

// interface OrderProps {
//   priceDataFromOrderResponse: OrderResponse;
//   address: AddressDTO;
//   systemVoucherNameAndId?: {
//     name: string;
//     id: number;
//   } | null;
//   paymentMethod: string;
//   updateOrderRequest: (
//     updates: Partial<OrderRequestWithProductVariant>
//   ) => void;
//   handlePlaceOrder: () => void;
// }

// export const Order: FC<OrderProps> = ({ ...props }) => {
//   const { systemVouchers, isLoading, error } = useSystemVoucher();
//   const [selectedVouchersOfSystem, setSelectedVouchersOfSystem] = useState<
//     number[]
//   >([]);

//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState<string>("");

//   const [voucherCode, setVoucherCode] = useState<string>("");
//   const [isLoading_, setIsLoading] = useState<boolean>(false);
//   const [error_, setError] = useState<string | null>(null);

//   const [usePoints, setUsePoints] = useState<boolean>();

//   const systemVoucherNameAndIdMemo = useMemo(
//     () => props.systemVoucherNameAndId,
//     [props.systemVoucherNameAndId]
//   );

//   const paymentMethodMemo = useMemo(
//     () => props.paymentMethod,
//     [props.paymentMethod]
//   );

//   const [isFirstRender, setIsFirstRender] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         if (systemVoucherNameAndIdMemo) {
//           setSelectedVouchersOfSystem([systemVoucherNameAndIdMemo.id]);
//         }

//         if (props.paymentMethod) {
//           setSelectedPaymentMethod(paymentMethodMemo);
//         }

//         // Check if loyalty points are being used
//         // if (props.priceDataFromOrderResponse.orderDTO.loyaltyPointHistoryDTO) {
//         //   setUsePoints(true);
//         // }
//       } catch (error) {
//         setError("Failed to fetch data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//     if (isFirstRender) {
//       setIsFirstRender(false);
//     }
//   }, []);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   const handleVouchersOfSystem = (
//     voucherId: number,
//     voucherCode: string
//   ): void => {
//     if (selectedVouchersOfSystem.includes(voucherId)) {
//       setVoucherCode("CANCEL");
//     } else {
//       setVoucherCode(voucherCode);
//       setSelectedVouchersOfSystem((prev) => [...prev, voucherId]);
//     }
//   };

//   const handlePaymentMethod = (paymentMethod: string): void => {
//     setSelectedPaymentMethod(paymentMethod);
//   };

//   useEffect(() => {
//     if (voucherCode === "CANCEL") {
//       setSelectedVouchersOfSystem([]);
//     }
//   }, [voucherCode]);

//   useEffect(() => {
//     if (
//       selectedVouchersOfSystem.length > 0 &&
//       voucherCode !== "CANCEL" &&
//       voucherCode !== ""
//     ) {
//       props.updateOrderRequest({
//         systemVoucherCode: voucherCode,
//       });
//     } else if (voucherCode === "CANCEL") {
//       props.updateOrderRequest({
//         systemVoucherCode: "CANCEL",
//       });
//     }
//   }, [selectedVouchersOfSystem]);

//   useEffect(() => {
//     if (selectedPaymentMethod !== "") {
//       props.updateOrderRequest({
//         paymentMethod: selectedPaymentMethod,
//       });
//     }
//   }, [selectedPaymentMethod]);

//   useEffect(() => {
//     if (usePoints !== undefined && usePoints !== null) {
//       props.updateOrderRequest({
//         useLoyaltyPoint: usePoints,
//       });
//     }
//   }, [usePoints]);

//   if (isLoading_) {
//     return <div>Loading...</div>;
//   }

//   if (error_) {
//     return <div>{error_}</div>;
//   }

//   if (isLoading) {
//     return <div>Loading System Voucher...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="h-auto ">
//         <AddressInfo
//           address={props.address}
//           updateOrderRequest={props.updateOrderRequest}
//         />
//       </div>

//       <OrderFromShop
//         order={props.priceDataFromOrderResponse}
//         updateOrderRequest={props.updateOrderRequest}
//         formatPrice={formatPrice}
//       />

//       <div className="my-4 bg-white flex flex-col">
//         <div className=" flex flex-col shadow-md rounded px-8 py-6">
//           {/* LoyaltyPoint */}
//           <div className="bg-white flex justify-between mb-4">
//             <span className="text-gray-700 text-2xl font-medium">
//               Điểm tích lũy
//             </span>

//             <label className="inline-flex items-center cursor-pointer">
//               <span className="ms-3 text-sm pr-4 font-medium text-red-900 dark:text-gray-300">
//                 Điểm tích lũy: {props.priceDataFromOrderResponse.totalPoint}
//               </span>
//               <input
//                 type="checkbox"
//                 value=""
//                 className="sr-only peer"
//                 disabled={props.priceDataFromOrderResponse.totalPoint === 0}
//                 checked={
//                   !!props.priceDataFromOrderResponse.orderDTO
//                     .loyaltyPointHistoryDTO
//                 }
//                 onChange={() => {
//                   setUsePoints(
//                     !props.priceDataFromOrderResponse.orderDTO
//                       .loyaltyPointHistoryDTO
//                   );
//                 }}
//               />
//               <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           {/* payment method */}
//           <div className="bg-white flex justify-between mb-4">
//             <span className="text-gray-700 text-2xl font-medium">
//               Phương thức thanh toán
//             </span>
//             <select
//               className="border border-gray-300 rounded-md w-auto"
//               value={selectedPaymentMethod}
//               onChange={(e) => handlePaymentMethod(e.target.value)}
//             >
//               <option value="COD">Thanh toán khi nhận hàng</option>
//               <option value="VNPay">Thanh toán qua VNPay</option>
//               <option value="Wallet">Thanh toán qua ví</option>
//             </select>
//           </div>
//           {selectedPaymentMethod === "Wallet" && (
//             <div className="flex justify-between">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Số dư ví
//               </span>
//               <span className="text-red-600">
//                 {props.priceDataFromOrderResponse.balance}
//               </span>
//             </div>
//           )}
//           <div className="border-t my-4 border-black-200"></div>

//           {/* system voucher */}
//           <div className="bg-white flex justify-between mb-4">
//             <span className="text-gray-700 text-2xl font-medium">
//               Voucher hệ thống
//             </span>
//             <span className="text-gray-700 text-2xl font-medium ml-auto">
//               {props.systemVoucherNameAndId
//                 ? props.systemVoucherNameAndId.name
//                 : "Không có voucher"}
//             </span>
//           </div>

//           {/* sys voucher */}
//           <div className="flex justify-between px-4 items-center mb-4">
//             <div className="flex items-center">
//               <img
//                 src="/public/voucher.png"
//                 alt="Voucher Icon"
//                 className="mr-2"
//                 style={{ width: "30px", height: "28px" }}
//               />
//               <span className="text-red-500">Voucher VTC</span>
//             </div>

//             <Vouchers
//               key={-1}
//               vouchers={systemVouchers}
//               onClose={() => {}}
//               onVoucherSelect_fix={handleVouchersOfSystem}
//               selectedVouchers={selectedVouchersOfSystem}
//             />
//           </div>

//           {selectedVouchersOfSystem.length > 0 && (
//             <VoucherDetails
//               voucher={
//                 systemVouchers!.find(
//                   (v) => v.voucherId === selectedVouchersOfSystem[0]
//                 )!
//               }
//             />
//           )}
//           <div className="border-t my-4 border-black-200"></div>

//           {/* price */}
//           <div className="flex flex-col  rounded px-8 py-6 mb-4">
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Tổng tiền hàng
//               </span>
//               <span className="text-gray-700 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromOrderResponse.orderDTO.totalPrice
//                 )}
//               </span>
//             </div>
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Tiền giảm voucher
//               </span>
//               <span className="text-red-500 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromOrderResponse.orderDTO.discountShop +
//                     props.priceDataFromOrderResponse.orderDTO.discountSystem
//                 )}{" "}
//                 VNĐ
//               </span>
//             </div>
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Phí vận chuyển
//               </span>
//               <span className="text-gray-700 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromOrderResponse.orderDTO.shippingFee
//                 )}{" "}
//               </span>
//             </div>
//             <div className="border-t my-4 border-black-200"></div>
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Tổng tiền
//               </span>
//               <span className="text-gray-700 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromOrderResponse.orderDTO.paymentTotal
//                 )}
//               </span>
//             </div>
//           </div>

//           <div className="border-t my-4 border-black-200"></div>

//           {/* dat hang */}
//           <div className="w-4/5 mx-auto mb-8 flex justify-end">
//             <button
//               onClick={props.handlePlaceOrder}
//               className={`bg-blue-500 hover:bg-blue-800 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//                 props.priceDataFromOrderResponse.balance === 0 &&
//                 selectedPaymentMethod === "Wallet"
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : ""
//               }`}
//               type="button"
//               disabled={
//                 props.priceDataFromOrderResponse.balance === 0 &&
//                 selectedPaymentMethod === "Wallet"
//               }
//             >
//               {props.priceDataFromOrderResponse.balance === 0 &&
//               selectedPaymentMethod === "Wallet"
//                 ? "Số dư ví không đủ"
//                 : "Đặt hàng"}
//             </button>
//           </div>
//           <ToastContainer />
//         </div>
//       </div>
//     </div>
//   );
// };

// import {
//   AddressDTO,
//   MultipleOrderResponse,
// } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
// import { FC, useEffect, useMemo, useState } from "react";
// import { AddressInfo } from "./AddressInfo";
// import { ToastContainer } from "react-toastify";
// import Vouchers from "./Voucher/vouchers";
// import VoucherDetails from "./Voucher/VoucherDetails";
// import { OrderRequestWithCart } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
// import { useSystemVoucher } from "@/hooks/useSystemVoucher";
// import { OrdersFromAShop } from "./OrdersFromAShop";
//
// interface OrderProps {
//   priceDataFromMultipleOrderResponse: MultipleOrderResponse;
//   address: AddressDTO;
//   systemVoucherNameAndId?: {
//     name: string;
//     id: number;
//   } | null;
//   paymentMethod: string;
//   updateOrderRequest: (
//     index: number,
//     updates: Partial<OrderRequestWithCart>,
//   ) => void;
//   handlePlaceOrder: () => void;
// }
//
// export const Order: FC<OrderProps> = ({ ...props }) => {
//   //state
//   const { systemVouchers, isLoading, error } = useSystemVoucher();
//   const [showSystemVoucherForm, setShowSystemVoucherForm] = useState(false);
//   // const [systemFromVouchers, setSystemFromVouchers] = useState<VoucherDTO[]>();
//   const [selectedVouchersOfSystem, setSelectedVouchersOfSystem] = useState<
//     number[]
//   >([]);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState<string>("");
//
//   const [voucherCode, setVoucherCode] = useState<string>("");
//   const [isLoading_, setIsLoading] = useState<boolean>(false); // Thêm trạng thái loading
//   const [error_, setError] = useState<string | null>(null); // Thêm trạng thái lỗi
//
//   const [usePoints, setUsePoints] = useState<boolean>();
//
//   console.log("props: ", props.priceDataFromMultipleOrderResponse);
//   const systemVoucherNameAndIdMemo = useMemo(
//     () => props.systemVoucherNameAndId,
//     [props.systemVoucherNameAndId],
//   );
//
//   const paymentMethodMemo = useMemo(
//     () => props.paymentMethod,
//     [props.paymentMethod],
//   );
//
//   const [isFirstRender, setIsFirstRender] = useState(true);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true); // Đánh dấu đang tải dữ liệu
//       setError(null); // Xóa lỗi trước khi gọi API
//
//       try {
//         console.log("into getSystemVoucherData ");
//         // await fetchSystemVoucher();
//         console.log("customhook: ", systemVouchers);
//         // setSystemFromVouchers(systemVouchers);
//         // if (props.systemVoucherNameAndId) {
//         //   console.log("systemVoucherNameAndId: ", props.systemVoucherNameAndId);
//         //   setSelectedVouchersOfSystem([props.systemVoucherNameAndId.id]);
//         // }
//         if (systemVoucherNameAndIdMemo) {
//           console.log("systemVoucherNameAndId: ", systemVoucherNameAndIdMemo);
//           setSelectedVouchersOfSystem([systemVoucherNameAndIdMemo.id]);
//         }
//
//         if (props.paymentMethod) {
//           setSelectedPaymentMethod(paymentMethodMemo);
//         }
//
//         //check loyalty point and update
//         // if (
//         //   props.priceDataFromMultipleOrderResponse.orderResponses[0].orderDTO
//         //     .loyaltyPointHistoryDTO
//         // ) {
//         //   setUsePoints(true);
//         // }
//       } catch (error) {
//         setError("Failed to fetch data"); // Lưu thông báo lỗi nếu có
//       } finally {
//         setIsLoading(false); // Đánh dấu đã tải xong dữ liệu
//       }
//     };
//
//     fetchData();
//     // Đánh dấu rằng đây không phải là lần render đầu tiên
//     if (isFirstRender) {
//       setIsFirstRender(false);
//     }
//   }, []);
//
//   //format price
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };
//
//   const handleVouchersOfSystem = (
//     voucherId: number,
//     voucherCode: string,
//   ): void => {
//     if (selectedVouchersOfSystem.includes(voucherId)) {
//       setVoucherCode("CANCEL");
//     } else {
//       setVoucherCode(voucherCode);
//       setSelectedVouchersOfSystem((prev) => [...prev, voucherId]);
//     }
//   };
//
//   const handlePaymentMethod = (paymentMethod: string): void => {
//     setSelectedPaymentMethod(paymentMethod);
//   };
//
//   useEffect(() => {
//     if (voucherCode === "CANCEL") {
//       setSelectedVouchersOfSystem([]);
//     }
//   }, [voucherCode]);
//
//   useEffect(() => {
//     console.log("selected sys voucher111111: ", selectedVouchersOfSystem);
//     console.log("voucher code: ", voucherCode);
//     if (
//       selectedVouchersOfSystem.length > 0 &&
//       voucherCode !== "CANCEL" &&
//       voucherCode !== ""
//     ) {
//       console.log("into systemVoucherCode");
//       console.log("voucherCode bellow into systemVoucherCode: ", voucherCode);
//       props.updateOrderRequest(-1, {
//         systemVoucherCode: voucherCode,
//       });
//     } else if (voucherCode === "CANCEL") {
//       console.log("into cancel");
//       props.updateOrderRequest(-1, {
//         systemVoucherCode: "CANCEL",
//       });
//     }
//   }, [selectedVouchersOfSystem]);
//
//   useEffect(() => {
//     console.log("selectedPaymentMethod: ", selectedPaymentMethod);
//     if (selectedPaymentMethod !== "") {
//       props.updateOrderRequest(-1, {
//         paymentMethod: selectedPaymentMethod,
//       });
//     }
//   }, [selectedPaymentMethod]);
//
//   useEffect(() => {
//     console.log("usePoints: ", usePoints);
//     if (usePoints !== undefined && usePoints !== null) {
//       console.log("into usePoint: ", usePoints);
//       props.updateOrderRequest(0, {
//         useLoyaltyPoint: usePoints,
//       });
//     }
//   }, [usePoints]);
//
//   // Hiển thị thông báo tương ứng dựa trên trạng thái
//   if (isLoading_) {
//     return <div>Loading...</div>;
//   }
//
//   if (error_) {
//     return <div>{error_}</div>;
//   }
//
//   // Kiểm tra trạng thái isLoading và error cua useSysVoucher trước khi sử dụng dữ liệu
//   if (isLoading) {
//     return <div>Loading System Voucher...</div>;
//   }
//
//   if (error) {
//     return <div>{error}</div>;
//   }
//
//   return (
//     <div className="flex flex-col gap-4">
//       {/* address */}
//       <div className="h-auto ">
//         <AddressInfo
//           address={props.address}
//           updateOrderRequest={props.updateOrderRequest}
//         />
//       </div>
//
//       {/* item */}
//       {props.priceDataFromMultipleOrderResponse.orderResponses.map(
//         (order, index) => (
//           <OrdersFromAShop
//             key={index}
//             order={order}
//             updateOrderRequest={(updates) =>
//               props.updateOrderRequest(index, updates)
//             }
//             formatPrice={formatPrice}
//           />
//         ),
//       )}
//
//       <div className="my-4 bg-white flex flex-col">
//         <div className=" flex flex-col shadow-md rounded px-8 py-6">
//           {/* LoyaltyPoint */}
//           <div className="bg-white flex justify-between mb-4">
//             <span className="text-gray-700 text-2xl font-medium">
//               Điểm tích lũy
//             </span>
//
//             <label className="inline-flex items-center cursor-pointer">
//               {/* <input type="checkbox" value="" className="sr-only peer" /> */}
//               <span className="ms-3 text-sm pr-4 font-medium text-red-900 dark:text-gray-300">
//                 Điểm tích lũy:{" "}
//                 {
//                   props.priceDataFromMultipleOrderResponse.orderResponses[0]
//                     .totalPoint
//                 }
//               </span>
//               <input
//                 type="checkbox"
//                 value=""
//                 className="sr-only peer"
//                 disabled={
//                   props.priceDataFromMultipleOrderResponse.totalLoyaltyPoint ===
//                   0
//                 }
//                 checked={
//                   props.priceDataFromMultipleOrderResponse.orderResponses[0]
//                     .orderDTO.loyaltyPointHistoryDTO
//                     ? true
//                     : false
//                 }
//                 onChange={() => {
//                   setUsePoints(
//                     !props.priceDataFromMultipleOrderResponse.orderResponses[0]
//                       .orderDTO.loyaltyPointHistoryDTO
//                       ? true
//                       : false,
//                   );
//                 }}
//               />
//               <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//
//           {/* payment method */}
//           <div className="bg-white flex justify-between mb-4">
//             <span className="text-gray-700 text-2xl font-medium">
//               Phương thức thanh toán
//             </span>
//             {/* <span className="text-gray-700 text-2xl font-medium ml-auto"> */}
//             {/*   // {props.paymentMethod} */}
//             {/*   //{" "} */}
//             {/* </span> */}
//             <select
//               className="border border-gray-300 rounded-md w-auto"
//               value={selectedPaymentMethod}
//               onChange={(e) => handlePaymentMethod(e.target.value)}
//             >
//               <option value="COD">Thanh toán khi nhận hàng</option>
//               <option value="VNPay">Thanh toán qua VNPay</option>
//               <option value="Wallet">Thanh toán qua ví</option>
//             </select>
//           </div>
//           {selectedPaymentMethod === "Wallet" && (
//             <div className="flex justify-between">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Số dư ví
//               </span>
//               <span className="text-red-600">
//                 {
//                   props.priceDataFromMultipleOrderResponse.orderResponses[0]
//                     .balance
//                 }
//               </span>
//             </div>
//           )}
//           <div className="border-t my-4 border-black-200"></div>
//
//           {/* system voucher */}
//           <div className="bg-white flex justify-between mb-4">
//             <span className="text-gray-700 text-2xl font-medium">
//               Voucher hệ thống
//             </span>
//             <span className="text-gray-700 text-2xl font-medium ml-auto">
//               {props.systemVoucherNameAndId
//                 ? props.systemVoucherNameAndId.name
//                 : "Không có voucher"}
//             </span>
//           </div>
//
//           {/* sys voucher */}
//           <div className="flex justify-between px-4 items-center mb-4">
//             <div className="flex items-center">
//               <img
//                 src="/public/voucher.png"
//                 alt="Voucher Icon"
//                 className="mr-2"
//                 style={{ width: "30px", height: "28px" }}
//               />
//               <span className="text-red-500">Voucher VTC</span>
//             </div>
//
//             <Vouchers
//               key={-1}
//               vouchers={systemVouchers}
//               onClose={() => setShowSystemVoucherForm(false)}
//               onVoucherSelect_fix={handleVouchersOfSystem}
//               selectedVouchers={selectedVouchersOfSystem}
//             />
//             {/* <button */}
//             {/*   className="text-blue-500 hover:underline cursor-pointer" */}
//             {/*   onClick={() => setShowSystemVoucherForm(true)} */}
//             {/* > */}
//             {/*   Chọn voucher */}
//             {/* </button> */}
//           </div>
//
//           {/* {showSystemVoucherForm && ( */}
//           {/*   <Vouchers */}
//           {/*     key={-1} */}
//           {/*     vouchers={systemVouchers} */}
//           {/*     onClose={() => setShowSystemVoucherForm(false)} */}
//           {/*     onVoucherSelect_fix={handleVouchersOfSystem} */}
//           {/*     selectedVouchers={selectedVouchersOfSystem} */}
//           {/*   /> */}
//           {/* )} */}
//           {selectedVouchersOfSystem.length > 0 && (
//             <VoucherDetails
//               voucher={
//                 systemVouchers!.find(
//                   (v) => v.voucherId === selectedVouchersOfSystem[0],
//                 )!
//               }
//             />
//           )}
//           <div className="border-t my-4 border-black-200"></div>
//
//           {/* price */}
//           <div className="flex flex-col  rounded px-8 py-6 mb-4">
//             {/* Existing content */}
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Tổng tiền hàng
//               </span>
//               <span className="text-gray-700 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromMultipleOrderResponse.totalPrice,
//                 )}
//               </span>
//             </div>
//             {/* Tiền vận chuyển Section */}
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Tiền giảm voucher
//               </span>
//               <span className="text-red-500 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromMultipleOrderResponse.totalDiscount,
//                 )}{" "}
//                 VNĐ
//               </span>
//             </div>
//             {/* Tiền vận chuyển Section */}
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Phí vận chuyển
//               </span>
//               <span className="text-gray-700 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromMultipleOrderResponse.totalShippingFee,
//                 )}{" "}
//               </span>
//             </div>
//             <div className="border-t my-4 border-black-200"></div>
//             {/* Tổng tiền Section */}
//             <div className="bg-white flex justify-between mb-4">
//               <span className="text-gray-700 text-2xl font-medium">
//                 Tổng tiền
//               </span>
//               <span className="text-gray-700 text-2xl font-medium">
//                 {formatPrice(
//                   props.priceDataFromMultipleOrderResponse.totalPayment,
//                 )}
//               </span>
//             </div>
//           </div>
//
//           <div className="border-t my-4 border-black-200"></div>
//
//           {/* dat hang */}
//           <div className="w-4/5 mx-auto mb-8 flex justify-end">
//             <button
//               onClick={props.handlePlaceOrder}
//               className={`bg-blue-500 hover:bg-blue-800 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${props.priceDataFromMultipleOrderResponse.orderResponses[0].balance === 0 && selectedPaymentMethod === "Wallet" ? "bg-gray-600 cursor-not-allowed" : ""}`}
//               type="button"
//               disabled={
//                 props.priceDataFromMultipleOrderResponse.orderResponses[0]
//                   .balance === 0 && selectedPaymentMethod === "Wallet"
//               }
//             >
//               {props.priceDataFromMultipleOrderResponse.orderResponses[0]
//                 .balance === 0 && selectedPaymentMethod === "Wallet"
//                 ? "Số dư ví không đủ"
//                 : "Đặt hàng"}
//             </button>
//           </div>
//           <ToastContainer />
//         </div>
//       </div>
//     </div>
//   );
// };
