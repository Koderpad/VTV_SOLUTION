import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import {
  NavLink,
  Link,
  createSearchParams,
  useNavigate,
} from "react-router-dom";
import useQueryParams from "@/hooks/useQueryParams";
import {
  useGetOrderListQuery,
  useGetOrderListByStatusQuery,
  useGetOrderDetailQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/vendor/orders/ordersApiSlice";
import {
  OrderDTO,
  OrderResponse,
} from "@/utils/DTOs/vendor/orders/Response/OrderResponse";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const purchasesStatus = {
  ALL: "ALL",
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PICKUP_PENDING: "PICKUP_PENDING",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  RETURNED: "RETURNED",
  WAITING: "WAITING",
  CANCEL: "CANCEL",
  REFUNDED: "REFUNDED",
  PAID: "PAID",
  UNPAID: "UNPAID",
  FAIL: "FAIL",
} as const;

const purchaseTabs = [
  { status: purchasesStatus.ALL, name: "Tất cả" },
  { status: purchasesStatus.PENDING, name: "Đang chờ xử lý" },
  { status: purchasesStatus.PROCESSING, name: "Đang xử lý" },
  { status: purchasesStatus.PICKUP_PENDING, name: "Chờ lấy hàng" },
  { status: purchasesStatus.SHIPPING, name: "Đang giao" },
  { status: purchasesStatus.DELIVERED, name: "Đã giao" },
  { status: purchasesStatus.COMPLETED, name: "Hoàn thành" },
  { status: purchasesStatus.RETURNED, name: "Đã trả lại" },
  { status: purchasesStatus.CANCEL, name: "Đã hủy" },
  { status: purchasesStatus.REFUNDED, name: "Đã hoàn tiền" },
  { status: purchasesStatus.PAID, name: "Đã thanh toán" },
  { status: purchasesStatus.UNPAID, name: "Chưa thanh toán" },
  { status: purchasesStatus.WAITING, name: "Đang chờ" },
];

export const Orders: React.FC = () => {
  const queryParams: { status?: string } = useQueryParams();
  const status: string = queryParams.status || purchasesStatus.ALL;
  const navigate = useNavigate();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: allOrdersData, refetch: refetchAllOrders } =
    useGetOrderListQuery();
  const { data: statusOrdersData, refetch: refetchStatusOrders } =
    useGetOrderListByStatusQuery(
      { status },
      { skip: status === purchasesStatus.ALL }
    );
  const { data: orderDetailData } = useGetOrderDetailQuery(
    selectedOrderId || "",
    { skip: !selectedOrderId }
  );
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders =
    status === purchasesStatus.ALL
      ? allOrdersData?.orderDTOs
      : statusOrdersData?.orderDTOs;

  useEffect(() => {
    if (status === purchasesStatus.ALL) {
      refetchAllOrders();
    } else {
      refetchStatusOrders();
    }
  }, [status, refetchAllOrders, refetchStatusOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      if (status === purchasesStatus.ALL) {
        refetchAllOrders();
      } else {
        refetchStatusOrders();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handleOrderDetailClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderOrderStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PENDING: "Đang chờ xử lý",
      PROCESSING: "Đang xử lý",
      PICKUP_PENDING: "Chờ lấy hàng",
      SHIPPING: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      COMPLETED: "Hoàn thành",
      RETURNED: "Đã trả lại",
      WAITING: "Đang chờ",
      CANCEL: "Đã hủy",
      REFUNDED: "Đã hoàn tiền",
      PAID: "Đã thanh toán",
      UNPAID: "Chưa thanh toán",
      FAIL: "Thất bại",
    };
    return statusMap[status] || "Không xác định";
  };

  const OrderDetailDialog = ({
    order,
  }: {
    order: OrderResponse | undefined;
  }) => {
    if (!order) return null;

    return (
      <DialogContent
        className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng: {order.orderDTO.orderId}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h3 className="text-lg font-semibold">Thông tin đơn hàng</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Trạng thái:</strong>{" "}
              {renderOrderStatus(order.orderDTO.status)}
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong>{" "}
              {formatDate(order.orderDTO.orderDate)}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {formatPrice(order.orderDTO.paymentTotal)} VNĐ
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {order.orderDTO.paymentMethod}
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-4">Sản phẩm</h3>
          {order.orderDTO.orderItemDTOs.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 border-b pb-2"
            >
              <img
                src={item.productVariantDTO.image}
                alt={item.productVariantDTO.productName}
                className="w-16 h-16 object-cover"
              />
              <div>
                <p className="font-semibold">
                  {item.productVariantDTO.productName}
                </p>
                <p>Số lượng: {item.quantity}</p>
                <p>Giá: {formatPrice(item.price)} VNĐ</p>
              </div>
            </div>
          ))}

          <h3 className="text-lg font-semibold mt-4">Địa chỉ giao hàng</h3>
          <p>{order.orderDTO.addressDTO.fullName}</p>
          <p>{order.orderDTO.addressDTO.phone}</p>
          <p>{order.orderDTO.addressDTO.fullAddress}</p>

          <h3 className="text-lg font-semibold mt-4">Lịch sử vận chuyển</h3>
          {order.transportDTO.transportHandleDTOs.map((handle, index) => (
            <div key={index} className="border-l-2 border-blue-500 pl-4 mb-2">
              <p>
                <strong>{formatDate(handle.createAt)}:</strong>{" "}
                {handle.messageStatus}
              </p>
              <p>Trạng thái: {renderOrderStatus(handle.transportStatus)}</p>
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center mb-4">
        {purchaseTabs.map((tab) => (
          <Link
            key={tab.status}
            to={{
              pathname: "/vendor/orders",
              search: createSearchParams({
                status: tab.status,
              }).toString(),
            }}
            className={cn("px-4 py-2 m-1 rounded-full text-sm font-medium", {
              "bg-blue-500 text-white": status === tab.status,
              "bg-gray-200 text-gray-700 hover:bg-gray-300":
                status !== tab.status,
            })}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {orders?.map((order: OrderDTO) => (
          <div
            key={order.orderId}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Đơn hàng: {order.orderId}
              </h3>
              <span className="text-sm text-gray-500">
                {formatDate(order.orderDate)}
              </span>
            </div>

            {order.orderItemDTOs.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 mb-2 pb-2 border-b"
              >
                <img
                  src={item.productVariantDTO.productImage}
                  alt={item.productVariantDTO.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-grow">
                  <p className="font-medium">
                    {item.productVariantDTO.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <p className="text-blue-600 font-semibold">
                  {formatPrice(item.totalPrice)} VNĐ
                </p>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">
                  Tổng tiền:{" "}
                  <span className="font-semibold text-blue-600">
                    {formatPrice(order.paymentTotal)} VNĐ
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Trạng thái:{" "}
                  <span className="font-medium">
                    {renderOrderStatus(order.status)}
                  </span>
                </p>
              </div>
              <div className="space-x-2">
                {order.status === "PENDING" && (
                  <Button
                    onClick={() =>
                      handleStatusUpdate(order.orderId, "PROCESSING")
                    }
                    variant="outline"
                  >
                    Xử lý
                  </Button>
                )}
                {order.status === "PROCESSING" && (
                  <Button
                    onClick={() =>
                      handleStatusUpdate(order.orderId, "PICKUP_PENDING")
                    }
                    variant="outline"
                  >
                    Chờ lấy hàng
                  </Button>
                )}
                {order.status === "WAITING" && (
                  <Button
                    onClick={() => handleStatusUpdate(order.orderId, "CANCEL")}
                    variant="outline"
                  >
                    Chấp nhận hủy đơn
                  </Button>
                )}
                {order.status === "WAITING" && (
                  <Button
                    onClick={() =>
                      handleStatusUpdate(order.orderId, "PICKUP_PENDING")
                    }
                    variant="outline"
                  >
                    Từ chối hủy đơn
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => handleOrderDetailClick(order.orderId)}
                      variant="outline"
                    >
                      Xem chi tiết
                    </Button>
                  </DialogTrigger>
                  <OrderDetailDialog order={orderDetailData} />
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
