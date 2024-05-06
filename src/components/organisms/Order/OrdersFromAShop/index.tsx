import React, { useEffect, useState } from "react";
import VoucherDetails from "../Voucher/VoucherDetails";
import Vouchers from "../Voucher/vouchers";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";
import { OrderResponse } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
import { FaTruck } from "react-icons/fa";
import { OrderRequestWithCart } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
import { useShopVoucher } from "@/hooks/useShopVoucher";

interface OrderDetailsProps {
  order: OrderResponse;
  updateOrderRequest: (updates: Partial<OrderRequestWithCart>) => void;
  formatPrice: (price: number) => string;
}

export const OrdersFromAShop: React.FC<OrderDetailsProps> = ({ ...props }) => {
  const { order, updateOrderRequest, formatPrice } = props;
  const { shopVouchers, isLoading, error, fetchShopVoucher } = useShopVoucher(
    order.orderDTO.shopDTO.shopId
  );
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [selectedVouchersOfShop, setSelectedVouchersOfShop] = useState<
    number[]
  >([]);

  const [shippingMethod, setShippingMethod] = useState<string | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [voucherCode, setVoucherCode] = useState<string>("");

  const handleToggleVoucherForm = () => {
    setShowVoucherForm(!showVoucherForm);
  };

  const handleVouchersOfShop = (voucherId: number, voucherCode: string) => {
    if (selectedVouchersOfShop.includes(voucherId)) {
      setVoucherCode("CANCEL");
    } else {
      setVoucherCode(voucherCode);
      setSelectedVouchersOfShop((prev) => [...prev, voucherId]);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        //get shop voucher from order
        const shopVoucher = order.orderDTO.voucherOrderDTOs.find(
          (v) => v.type === true
        );
        console.log("shopVoucher: ", shopVoucher);
        if (shopVoucher) {
          setSelectedVouchersOfShop([shopVoucher.voucherId]);
        }
      } catch (error) {
        // setError("Failed to fetch data"); // Lưu thông báo lỗi nếu có
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (voucherCode === "CANCEL") {
      setSelectedVouchersOfShop([]);
    }
  }, [voucherCode]);

  useEffect(() => {
    console.log("voucher code01010101: ", voucherCode);
    if (
      selectedVouchersOfShop.length > 0 &&
      voucherCode !== "CANCEL" &&
      voucherCode !== ""
    ) {
      updateOrderRequest({
        shopVoucherCode: voucherCode,
      });
    } else if (voucherCode === "CANCEL") {
      console.log("into cancel");
      updateOrderRequest({
        shopVoucherCode: "CANCEL",
      });
    }
  }, [selectedVouchersOfShop]);

  // isLoading, error
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="w-4/5 mx-auto mt-12 bg-white flex flex-col h-auto rounded-md"
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
        {/* <span className="text-gray-700 text-2xl font-medium">
          {order.orderDTO.shopDTO.address}
        </span> */}
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
            <tr key={item.cartId}>
              <td className="flex px-4 py-2">
                <strong>{item.productVariantDTO.productName}</strong>
              </td>
              <td className="px-4 py-2">
                <img
                  className="w-20 h-20 object-cover object-center"
                  src={item.productVariantDTO.productImage}
                  alt=""
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
        <button
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={handleToggleVoucherForm}
        >
          Chọn voucher
        </button>
      </div>
      {showVoucherForm && (
        <Vouchers
          key={order.orderDTO.shopDTO.shopId}
          vouchers={shopVouchers}
          onClose={() => setShowVoucherForm(false)}
          onVoucherSelect_fix={handleVouchersOfShop}
          selectedVouchers={selectedVouchersOfShop}
        />
      )}
      {selectedVouchersOfShop.length > 0 && (
        <VoucherDetails
          voucher={
            shopVouchers!.find(
              (v) => v.voucherId === selectedVouchersOfShop[0]
            )!
          }
        />
      )}

      {/* box */}
      <div className="border-t my-4 border-black-200"></div>
      {/* note, trans method */}
      <div className="flex flex-row justify-between px-4 py-2">
        <div className=" flex w-1/3">
          <span className="text-lg">Ghi chú:</span>
          <input type="text" className="bg-gray-400 flex-wrap w-full" />
        </div>
        {/* ranh gioi */}
        <div
          className="
        border-r border-black-200 h-20 w-0.5 my-2 mx-4 bg-black-200"
        ></div>
        {/* phuong thuc van chuyen */}
        <div className="flex w-2/3">
          <div className="bg-white flex justify-between mb-4">
            <span className="text-gray-700 text-2xl font-medium">
              Phương thức vận chuyển
            </span>
            <span className="text-gray-700 text-2xl font-medium ml-auto flex items-center">
              <button
                onClick={() => {
                  setIsOpen(true);
                }}
                className="mr-2"
              >
                <FaTruck size={20} />
              </button>
              {shippingMethod || "Chưa chọn"}
            </span>
          </div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6"
            hidden={!modalIsOpen}
          >
            <div className="flex flex-col bg-white p-4 rounded-md border border-gray-300">
              <h2 className="text-2xl font-semibold mb-4">
                Chọn phương thức vận chuyển
              </h2>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setShippingMethod("GHN")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Giao hàng nhanh
                </button>
                <button
                  onClick={() => setShippingMethod("GHTK")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Giao hàng tiết kiệm
                </button>
                <button
                  onClick={() => setShippingMethod("EXPRESS")}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Giao hàng siêu tốc độ
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
      {/* cacul */}
      <div className="bg-yellow-200 w-full">
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">Tạm tính</span>
          <span className="text-lg">
            {formatPrice(
              order.orderDTO.orderItemDTOs.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )
            )}{" "}
            VNĐ
          </span>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">Phí vận chuyển</span>
          <span className="text-lg">
            {caculTransportFee(shippingMethod || "")} VNĐ
          </span>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">Giảm giá</span>
          <span className="text-lg">
            {selectedVouchersOfShop.length > 0
              ? formatPrice(
                  caculShopVoucher(
                    order,
                    shopVouchers,
                    selectedVouchersOfShop
                  ) || 0
                ) + " VNĐ"
              : "0 VNĐ"}
          </span>
        </div>
        <div className="flex justify-between px-4 py-2">
          <span className="text-lg">
            Tổng cộng ({caculProductQuantity(order)} san pham)
          </span>
          <span className="text-lg">
            {formatPrice(
              order.orderDTO.orderItemDTOs.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              ) -
                (caculShopVoucher(
                  order,
                  shopVouchers,
                  selectedVouchersOfShop
                ) || 0) -
                caculTransportFee(
                  shippingMethod || order.orderDTO.shippingMethod
                )
            )}{" "}
            VNĐ
          </span>
        </div>
      </div>
    </div>
  );
};
const caculShopVoucher = (
  order: OrderResponse,
  shopVouchers: VoucherDTO[],
  selectedVouchersOfShop: number[]
) => {
  const voucher = shopVouchers.find(
    (v) => v.voucherId === selectedVouchersOfShop[0]
  );
  const type = voucher?.type;
  if (type === "PERCENTAGE_SHOP") {
    return order.orderDTO.orderItemDTOs.reduce(
      (acc, item) =>
        acc + (item.price * item.quantity * voucher?.discount!) / 100,
      0
    );
  } else {
    return voucher?.discount;
  }
};

const caculTransportFee = (shippingMethod: string) => {
  if (shippingMethod === "GHN") {
    return 20000;
  } else if (shippingMethod === "GHTK") {
    return 15000;
  } else if (shippingMethod === "EXPRESS") {
    return 30000;
  } else {
    return 0;
  }
};

const caculProductQuantity = (order: OrderResponse) => {
  return order.orderDTO.orderItemDTOs.reduce((acc) => acc + 1, 0);
};
