import { useNavigate, useParams } from "react-router-dom";

import { FaTruck } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useGetOrderByOrderIdQuery } from "../../redux/api/orderApi";
import React, { useEffect, useState } from "react";
import { useCheckReviewExistMutation } from "../../redux/api/reviewApi.ts";

interface AttributeDTO {
  attributeId: number;
  name: string;
  value: string;
  active: boolean;
  shopId: number;
}

interface ProductVariantDTO {
  productVariantId: number;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  status: string;
  productId: number;
  productName: string;
  productImage: string;
  attributeDTOs: AttributeDTO[];
}

interface AddressDTO {
  addressId: number;
  province: string;
  district: string;
  ward: string;
  fullAddress: string;
  fullName: string;
  phone: string;
  status: string;
}

interface OrderItemDTO {
  orderItemId: number;
  orderId: number;
  cartId: number;
  productVariantDTO: ProductVariantDTO;
  quantity: number;
  price: number;
}

interface VoucherOrderDTO {
  voucherOrderId?: number;
  voucherId?: number;
  voucherName?: string;
  type?: boolean;
  orderId?: number;
}

interface OrderDTO {
  orderId: number | null;
  note: string | null;
  paymentMethod: string;
  shippingMethod: string;
  count: number;
  shopId: number;
  shopName: string;
  totalPrice: number;
  discount: number;
  shippingFee: number;
  paymentTotal: number;
  status: string;
  addressDTO: AddressDTO;
  voucherOrderDTOs: VoucherOrderDTO[] | null;
  orderItemDTOs: OrderItemDTO[];
  orderDate: string;
}

interface ApiResponse {
  status: string;
  message: string;
  code: number;
  username?: string;
  orderDTO?: OrderDTO;
}

export const OrderDetailsForm = () => {
  const { id } = useParams();

  const { data: getOrderByOrderId } = useGetOrderByOrderIdQuery(parseInt(id!));

  const order: ApiResponse | undefined = getOrderByOrderId;
  console.log("order:  ", order?.orderDTO);

  if (order?.code !== 200) {
    console.log("error", order?.message);
  }

  const orderDetails: OrderDTO | undefined = order?.orderDTO;

  if (!orderDetails) {
    console.log("error", order?.message);
  }

  console.log("order:  ", orderDetails);

  const address: AddressDTO | undefined = orderDetails?.addressDTO;

  const voucher: VoucherOrderDTO[] | null | undefined =
    orderDetails?.voucherOrderDTOs;

  console.log("voucher: ", voucher);

  const voucherOfShop: VoucherOrderDTO[] | undefined = voucher?.filter(
    (e) => e.type === false
  );

  const voucherOfSys: VoucherOrderDTO[] | undefined = voucher?.filter(
    (e) => e.type !== false
  );

  console.log("voucher of sys: ", voucherOfSys);

  const [callApiCheckReview] = useCheckReviewExistMutation();

  const navigate = useNavigate();

  const handleReview = async (
    e: React.MouseEvent<HTMLButtonElement>,
    orderItemId: number
  ) => {
    e.preventDefault();
    console.log("orderItemId", orderItemId);
    const isExist = await callApiCheckReview(orderItemId).unwrap();

    console.log("ba", isExist);
    if (!isExist) {
      navigate(`/user/account/checkout/add/review/order-item/${orderItemId}`);
    } else {
      navigate(`/user/account/checkout/review/order-item/${orderItemId}`);
    }
  };

  const formatPrice = (price?: number) => {
    if (price !== undefined && price !== null) {
      const formattedPrice = price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return formattedPrice;
    } else {
      return "N/A"; // or any other default value or behavior
    }
  };

  return (
    <div className="bg-gray">
      <div className="flex bg-white h-full w-full py-8 mt-44 items-center">
        {/* Image */}
        <img
          src="/logo_border.png"
          alt="Description of the image"
          className="mr-8 ml-4"
          style={{ width: "50px", height: "50px" }}
        />

        <div className="flex items-center">
          <span className="whitespace-nowrap">VTC</span>

          <div className="h-10 w-1 bg-black ml-4"></div>
          <span className="whitespace-nowrap ml-4">Thanh Toán</span>
          <div className="h-10 w-1 bg-black ml-4"></div>
          <span className="whitespace-nowrap ml-4 text-red-600">
            Mã đơn hàng: #{orderDetails?.orderId}
          </span>
        </div>
      </div>

      {/* Additional Information Section */}
      <div
        className="w-4/5 mx-auto mt-4 bg-white flex flex-col h-36"
        style={{ borderTop: "4px solid red" }}
      >
        <div className="bg-white flex flex-col shadow-md rounded px-8 py-6 mb-4">
          <div className="bg-white flex flex-row ">
            <div className="mb-4 flex items-center">
              <span className="text-gray-700 text-2xl font-medium mr-2">
                {address?.fullName}
              </span>
              <span className="text-gray-700 text-2xl font-medium "> | </span>
              <span className="text-gray-700 text-2xl font-medium ml-2">
                {address?.phone}
              </span>
              <span className="text-gray-700 text-2xl font-medium ml-16">
                {address
                  ? `${address.province} | ${address.district} | ${address.ward}`
                  : "N/A"}
              </span>
            </div>
          </div>
          <span className="">Địa chỉ: {address?.fullAddress}</span>
          <div className="flex flex-row mt-4 "></div>
          <div className="inline-block border-2 border-red-300 rounded p-1 max-w-max">
            <span className="inline-block text-red-500">Địa chỉ</span>
          </div>
        </div>
      </div>

      <div
        className="w-4/5 mx-auto mt-12 bg-white flex flex-col h-auto rounded-md"
        style={{
          borderTop: "4px solid red",
          border: "none",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="px-4">Tên Sản phẩm</th>
              <th className="px-4">Ảnh Sản phẩm</th>
              <th className="px-4">Phân loại</th>
              <th className="px-4">Gía</th>
              <th className="px-4">Số lượng</th>
              <th className="px-4">Tổng</th>
              {orderDetails?.status === "COMPLETED" ? (
                <th className="px-4">Đánh giá</th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody>
            {orderDetails?.orderItemDTOs.map((item) => (
              <tr key={Math.random()}>
                <td className="px-4 py-2">
                  <h1>{item.productVariantDTO.productName}</h1>
                </td>

                <td className="px-4 py-2">
                  <img
                    className="w-20 h-20 object-cover object-center"
                    src={item.productVariantDTO.productImage}
                    alt=""
                  />
                </td>

                <td className="px-4 py-2">
                  {/* Hiển thị thông tin phân loại */}
                  {item.productVariantDTO.attributeDTOs.map((attribute) => (
                    <div key={Math.random()}>
                      <strong>{attribute.name}:</strong> {attribute.value}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">{formatPrice(item.price)} VNĐ</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">
                  {formatPrice(item.price * item.quantity)} VNĐ
                </td>

                {orderDetails?.status === "COMPLETED" ? (
                  <td className="px-4 py-2">
                    <button
                      className="flex items-center bg-red-500 hover:bg-red-800 focus:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={(e) => handleReview(e, item.orderItemId)}
                    >
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-2">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                    </button>
                  </td>
                ) : (
                  ""
                )}
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
          <span>
            {voucherOfShop && voucherOfShop.length > 0
              ? voucherOfShop[0].voucherName
              : "Không có"}
            {/* {voucherOfShop !== [] ? voucherOfShop[0].voucherName : ""} */}
          </span>
        </div>

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
          <span>
            {voucherOfSys
              ? voucherOfSys[0]
                ? voucherOfSys[0].voucherName
                : "Không có"
              : "Không có voucher"}
          </span>
        </div>
      </div>

      <div className="w-4/5 mx-auto mt-4 bg-white flex flex-col">
        <div className="bg-white flex flex-col shadow-md rounded px-8 py-6 mb-4">
          <div className="bg-white flex justify-between mb-4">
            <span className="text-gray-700 text-2xl font-medium">
              Phương thức vận chuyển
            </span>
            <span className="text-gray-700 text-2xl font-medium ml-auto flex items-center">
              <button className="mr-2">
                <FaTruck size={20} />
              </button>
              {orderDetails?.shippingMethod}
            </span>
          </div>
          <div className="bg-white flex justify-between mb-4">
            <span className="text-gray-700 text-2xl font-medium">
              Phương thức thanh toán
            </span>
            <span className="text-gray-700 text-2xl font-medium ml-auto">
              Thanh Toán khi nhận hàng (COD)
            </span>
          </div>
          <div className="border-t my-4 border-black-200"></div>

          <div className="flex flex-col  rounded px-8 py-6 mb-4">
            {/* Existing content */}
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Trạng thái
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {orderDetails?.status === "PENDING"
                  ? "Đang chờ xử lý"
                  : orderDetails?.status === "SHIPPING"
                    ? "Đang giao hàng"
                    : orderDetails?.status === "COMPLETED"
                      ? "Đã giao hàng"
                      : "Đã hủy"}
              </span>
            </div>

            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Tổng tiền hàng
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(orderDetails?.totalPrice)} VNĐ
              </span>
            </div>

            {/* Tiền vận chuyển Section */}
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Tiền giảm voucher
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(orderDetails?.discount)} VNĐ
              </span>
            </div>
            {/* Tiền vận chuyển Section */}
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Phí vận chuyển
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(orderDetails?.shippingFee)} VNĐ
              </span>
            </div>
            <div className="border-t my-4 border-black-200"></div>
            {/* Tổng tiền Section */}
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Tổng tiền
              </span>
              <span className="text-gray-700 text-2xl font-medium">
                {formatPrice(orderDetails?.paymentTotal)} VNĐ
              </span>
            </div>
          </div>
          <div className="border-t my-4 border-black-200"></div>
        </div>
      </div>
    </div>
  );
};
