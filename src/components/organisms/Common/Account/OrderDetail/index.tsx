import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByOrderIdQuery } from "@/redux/features/common/customer/customerApiSlice.ts";
import { FaTruck } from "react-icons/fa";
import { TransportHandleDTO } from "@/utils/DTOs/common/ProfileCustomer/Response/OrderResponse.ts";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: orderResponse } = useGetOrderByOrderIdQuery(id!);
  const navigate = useNavigate();

  if (!orderResponse) {
    return <div>Loading...</div>;
  }

  const { orderDTO, transportDTO, shippingDTO } = orderResponse;
  console.log(transportDTO, shippingDTO);

  const handleReview = (orderItemId: string) => {
    // navigate(`/user/account/checkout/add/review/order-item/${orderItemId}`);
  };

  const handleCancel = () => {
    // Logic to cancel the order
  };

  const handleComplete = () => {
    // Logic to mark the order as completed
  };

  const handleReturn = () => {
    // Logic to return the order
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getImportantStatuses = (transportHandleDTOs: TransportHandleDTO[]) => {
    const importantStatuses = transportHandleDTOs
      .filter((handle) =>
        [
          "PENDING",
          "PROCESSING",
          "PICKED_UP",
          "DELIVERED",
          "COMPLETED",
          "CANCEL",
        ].includes(handle.transportStatus)
      )
      .map((handle) => ({
        status: handle.transportStatus,
        createdAt: handle.createAt,
      }))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    return importantStatuses;
  };

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto py-8">
        {/* Order Status */}
        {transportDTO?.transportHandleDTOs && (
          <div className="bg-white p-4 mb-4">
            <h2 className="text-2xl font-bold mb-4">Trạng thái đơn hàng</h2>
            <div className="flex justify-between items-center">
              {getImportantStatuses(transportDTO.transportHandleDTOs).map(
                (status, index, statuses) => (
                  <div
                    key={status.status}
                    className="flex flex-col items-center"
                  >
                    <div className="flex items-center">
                      <FaTruck className="mr-2" />
                      <span>
                        {status.status === "PENDING"
                          ? "Đơn hàng đã đặt"
                          : status.status === "PROCESSING"
                            ? "Đã xác nhận"
                            : status.status === "PICKED_UP"
                              ? "Đã giao cho ĐVVC"
                              : status.status === "DELIVERED"
                                ? "Đã nhận được hàng"
                                : status.status === "COMPLETED"
                                  ? "Đơn hàng đã hoàn thành"
                                  : status.status === "CANCEL"
                                    ? "Đơn hàng đã bị hủy"
                                    : ""}
                      </span>
                    </div>
                    {index < statuses.length - 1 && (
                      <div className="border-t-2 border-dashed border-gray-300 flex-grow mx-4"></div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Shipping and Address Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4">
            <h2 className="text-xl font-bold mb-2">Thông tin địa chỉ</h2>
            <p>
              {orderDTO.addressDTO.fullName} | {orderDTO.addressDTO.phone}
            </p>
            <p>
              {orderDTO.addressDTO.fullAddress},{" "}
              {orderDTO.addressDTO.wardFullName},{" "}
              {orderDTO.addressDTO.districtFullName},{" "}
              {orderDTO.addressDTO.provinceFullName}
            </p>
          </div>
          <div className="bg-white p-4">
            <h2 className="text-xl font-bold mb-2">Thông tin vận chuyển</h2>
            <p>Phương thức vận chuyển: {orderDTO.shippingMethod}</p>
            <p>Trạng thái: {orderDTO.status}</p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Lịch sử đơn hàng</h2>
          <ul>
            {transportDTO.transportHandleDTOs ? (
              transportDTO.transportHandleDTOs.map(
                (handle: TransportHandleDTO) => (
                  <li key={handle.transportHandleId}>
                    <p>{handle.messageStatus}</p>
                    <p>{new Date(handle.createAt).toLocaleString()}</p>
                  </li>
                )
              )
            ) : (
              <p>Không có lịch sử vận chuyển.</p>
            )}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Tóm tắt đơn hàng</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Sản phẩm</th>
                <th className="text-right">Giá</th>
                <th className="text-right">Số lượng</th>
                <th className="text-right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {orderDTO.orderItemDTOs.map((item) => (
                <tr key={item.orderItemId}>
                  <td>
                    <div className="flex items-center">
                      <img
                        src={item.productVariantDTO.productImage}
                        alt={item.productVariantDTO.productName}
                        className="w-16 h-16 object-cover mr-4"
                      />
                      <div>
                        <p className="font-bold">
                          {item.productVariantDTO.productName}
                        </p>
                        {item.productVariantDTO.attributeDTOs.map((attr) => (
                          <p key={attr.attributeId}>
                            {attr.name}: {attr.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="text-right">{formatPrice(item.price)} VNĐ</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">
                    {formatPrice(item.totalPrice)} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-4">
          <h2 className="text-xl font-bold mb-2">Tóm tắt thanh toán</h2>
          <table className="w-full">
            <tbody>
              <tr>
                <td>Tổng tiền hàng</td>
                <td className="text-right">
                  {formatPrice(orderDTO.totalPrice)} VNĐ
                </td>
              </tr>
              <tr>
                <td>Phí vận chuyển</td>
                <td className="text-right">
                  {formatPrice(orderDTO.shippingFee)} VNĐ
                </td>
              </tr>
              <tr>
                <td>Giảm giá</td>
                <td className="text-right">
                  {formatPrice(orderDTO.discountShop + orderDTO.discountSystem)}{" "}
                  VNĐ
                </td>
              </tr>
              <tr>
                <td>Tổng thanh toán</td>
                <td className="text-right font-bold">
                  {formatPrice(orderDTO.paymentTotal)} VNĐ
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4">
            Phương thức thanh toán: {orderDTO.paymentMethod}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4">
          {/* <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
            onClick={() => navigate(`/shop/${orderDTO.shopDTO.name}`)}
          >
            Xem Shop
          </button> */}
          {/* {orderDTO.status === "COMPLETED" && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-4"
              onClick={() =>
                handleReview(orderDTO.orderItemDTOs[0].orderItemId)
              }
            >
              Đánh giá
            </button>
          )}
          {orderDTO.status === "PROCESSING" && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Hủy đơn hàng
            </button>
          )}
          {orderDTO.status === "DELIVERED" && (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                onClick={handleComplete}
              >
                Đã nhận được hàng
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleReturn}
              >
                Trả hàng
              </button>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
