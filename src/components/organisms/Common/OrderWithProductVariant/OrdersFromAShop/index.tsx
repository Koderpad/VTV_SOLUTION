import React, { useCallback, useEffect, useState } from "react";
import VoucherDetails from "../Voucher/VoucherDetails";
import Vouchers from "../Voucher/vouchers";
import { OrderResponse } from "@/utils/DTOs/common/Order/Response/OrderResponse";
import { FaTruck } from "react-icons/fa";
import { OrderRequestWithProductVariant } from "@/utils/DTOs/common/Order/Request/OrderRequestWithProductVariant";
import { useShopVoucher } from "@/hooks/useShopVoucher";
import { Input } from "@/components/atoms/Input";
import { debounce } from "lodash";

interface OrderDetailsProps {
  order: OrderResponse;
  updateOrderRequest: (
    updates: Partial<OrderRequestWithProductVariant>
  ) => void;
  formatPrice: (price: number) => string;
}

export const OrderFromShop: React.FC<OrderDetailsProps> = ({ ...props }) => {
  const { order, updateOrderRequest, formatPrice } = props;
  const { shopVouchers, isLoading, error } = useShopVoucher(
    order.orderDTO.shopDTO.shopId
  );
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [selectedVouchersOfShop, setSelectedVouchersOfShop] = useState<
    number[]
  >([]);

  const [shippingMethod, setShippingMethod] = useState<string>(
    order.orderDTO.shippingMethod
  );
  const [modalIsOpen, setIsOpen] = useState(false);

  const [voucherCode, setVoucherCode] = useState<string>("");

  const [note, setNote] = useState<string>("");

  // Debounce function for updating note
  const debouncedUpdateNote = useCallback(
    debounce((newNote: string) => {
      console.log("Updating note:", newNote);
      updateOrderRequest({ note: newNote });
    }, 500),
    []
  );

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNote = e.target.value;
    setNote(newNote);
    debouncedUpdateNote(newNote);
  };

  const handleVouchersOfShop = (voucherId: number, voucherCode: string) => {
    if (selectedVouchersOfShop.includes(voucherId)) {
      setVoucherCode("CANCEL");
      setSelectedVouchersOfShop([]);
      updateOrderRequest({ shopVoucherCode: "CANCEL" });
    } else {
      setVoucherCode(voucherCode);
      setSelectedVouchersOfShop([voucherId]);
      updateOrderRequest({ shopVoucherCode: voucherCode });
    }
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        const shopVoucher = order.orderDTO.voucherOrderDTOs.find(
          (v) => v.type === true
        );
        if (shopVoucher) {
          setSelectedVouchersOfShop([shopVoucher.voucherId]);
        }

        setShippingMethod(order.orderDTO.shippingMethod);
        setNote(order.orderDTO.note || "");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (shippingMethod !== order.orderDTO.shippingMethod) {
      updateOrderRequest({ shippingMethod: shippingMethod });
    }
  }, [shippingMethod]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="mt-8 bg-white flex flex-col h-auto rounded-md"
      style={{
        borderTop: "4px solid red",
        border: "none",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Shop Name */}
      <div className="bg-white flex flex-row justify-between px-4 py-2">
        <span className="text-2xl font-medium">
          {order.orderDTO.shopDTO.name}
        </span>
      </div>

      {/* Order Items */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="px-4">Sản phẩm</th>
            <th className="px-4">Hình ảnh</th>
            <th className="px-4">Phân loại</th>
            <th className="px-4">Giá</th>
            <th className="px-4">Số lượng</th>
            <th className="px-4">Tổng</th>
          </tr>
        </thead>
        <tbody>
          {order.orderDTO.orderItemDTOs.map((item) => (
            <tr key={item.orderItemId}>
              <td className="flex px-4 py-2">
                <strong>{item.productVariantDTO.productName}</strong>
              </td>
              <td className="px-4 py-2">
                <img
                  className="w-20 h-20 object-cover object-center"
                  src={item.productVariantDTO.productImage}
                  alt={item.productVariantDTO.productName}
                />
              </td>
              <td className="px-4 py-2">
                {item.productVariantDTO.attributeDTOs.map((attribute) => (
                  <div key={attribute.attributeId}>
                    <strong>{attribute.name}:</strong> {attribute.value}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2">{formatPrice(item.price)} VNĐ</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2">
                {formatPrice(item.price * item.quantity)} VNĐ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t my-4 border-black-200"></div>

      {/* Voucher Section */}
      <div className="flex justify-between px-4 items-center mb-4">
        <div className="flex items-center">
          <img
            src="/public/voucher.png"
            alt="Voucher Icon"
            className="mr-2"
            style={{ width: "30px", height: "28px" }}
          />
          <span className="text-red-500">Voucher của shop</span>
        </div>

        <Vouchers
          key={order.orderDTO.shopDTO.shopId}
          vouchers={shopVouchers}
          onClose={() => setShowVoucherForm(false)}
          onVoucherSelect_fix={handleVouchersOfShop}
          selectedVouchers={selectedVouchersOfShop}
        />
      </div>

      {selectedVouchersOfShop.length > 0 && shopVouchers && (
        <VoucherDetails
          voucher={
            shopVouchers.find((v) => v.voucherId === selectedVouchersOfShop[0])!
          }
        />
      )}

      {/* Note and Shipping Method */}
      <div className="border-t my-4 border-black-200"></div>
      <div className="flex flex-row justify-between px-4 py-2">
        <div className="flex w-1/3">
          <span className="text-lg">Ghi chú:</span>
          <Input
            placeholder="Nhập ghi chú"
            type="text"
            onChange={handleNoteChange}
            value={note}
          />
        </div>
        <div className="border-r border-black-200 h-20 w-0.5 my-2 mx-4 bg-black-200"></div>
        <div className="flex w-2/3">
          <div className="bg-white flex justify-between mb-4 w-full">
            <span className="text-gray-700 text-2xl font-medium">
              Phương thức vận chuyển
            </span>
            <span className="text-gray-700 text-1xl font-medium flex justify-start">
              <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col justify-start mr-2"
              >
                <FaTruck size={20} />
              </button>
              {shippingMethod || "Chưa chọn"}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Method Modal */}
      {modalIsOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            padding: "24px",
          }}
        >
          <div className="flex flex-col bg-white p-4 rounded-md border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4">
              Chọn phương thức vận chuyển
            </h2>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setShippingMethod("GHN");
                  setIsOpen(false);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Giao hàng nhanh
              </button>
              <button
                onClick={() => {
                  setShippingMethod("GHTK");
                  setIsOpen(false);
                }}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Giao hàng tiết kiệm
              </button>
              <button
                onClick={() => {
                  setShippingMethod("VTV Express");
                  setIsOpen(false);
                }}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Giao hàng siêu tốc độ VTV Express
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-yellow-200 w-full mt-4">
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">Tạm tính</span>
          <span className="text-lg">
            {formatPrice(order.orderDTO.totalPrice)}
          </span>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">Phí vận chuyển</span>
          <span className="text-lg">
            {formatPrice(order.orderDTO.shippingFee)}
          </span>
        </div>
        {order.orderDTO.loyaltyPointHistoryDTO && (
          <div className="flex justify-between px-4 py-2">
            <span className="text-lg">Điểm tích lũy</span>
            <span className="text-lg text-red-600">
              {formatPrice(order.orderDTO.loyaltyPointHistoryDTO.point)}
            </span>
          </div>
        )}
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">Giảm giá của cửa hàng</span>
          <span className="text-lg text-red-400">
            {formatPrice(order.orderDTO.discountShop)}
          </span>
        </div>
        {/* <div className="flex justify-between px-4 py-2">
          <span className="text-lg">
            Tổng cộng ({order.orderDTO.orderItemDTOs.length} sản phẩm)
          </span>
          <span className="text-lg">
            {formatPrice(order.orderDTO.paymentTotal)}
          </span>
        </div> */}
      </div>
    </div>
  );
};
