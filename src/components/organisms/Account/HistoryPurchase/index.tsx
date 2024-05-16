import { cn } from "@/utils/cn";
import { NavLink, Link, createSearchParams } from "react-router-dom";
import useQueryParams from "@/hooks/useQueryParams";
import {
  useCancelOrderMutation,
  useGetOrdersByStatusVer2Query,
  //   useCompleteOrderMutation,
  //   useReturnOrderMutation,
} from "@/redux/features/common/customer/customerApiSlice";
import {
  OrderDTO,
  OrderItemDTO,
} from "@/utils/DTOs/common/Order/Response/ListOrderResponse";
import { useEffect, useState } from "react";

const purchasesStatus = {
  ALL: 0,
  PENDING: 1,
  PROCESSING: 2,
  PICKUP_PENDING: 3,
  SHIPPING: 4,
  DELIVERED: 5,
  COMPLETED: 6,
  RETURNED: 7,
  WAITING: 8,
  CANCEL: 9,
  REFUNDED: 10,
  PAID: 11,
  UNPAID: 12,
  FAIL: 13,
} as const;

const purchaseStatusString = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "PICKUP_PENDING",
  "SHIPPING",
  "DELIVERED",
  "COMPLETED",
  "RETURNED",
  "WAITING",
  "CANCEL",
  "REFUNDED",
  "PAID",
  "UNPAID",
  "FAIL",
];

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
];

export const HistoryPurchase = () => {
  const queryParams: { status?: string } = useQueryParams();
  const status: number = Number(queryParams.status) || purchasesStatus.ALL;

  const [isUpdate, setIsUpdate] = useState(false);
  const statusString = purchaseStatusString[status];

  const {
    data: otherData,
    isLoading: isLoadingOther,
    isError: isErrorOther,
    refetch: refetchOther,
  } = useGetOrdersByStatusVer2Query(statusString);

  const [cancelOrder] = useCancelOrderMutation();
  //   const [completeOrder] = useCompleteOrderMutation();
  //   const [returnOrder] = useReturnOrderMutation();

  const refetchData = async () => {
    await refetchOther();
  };

  useEffect(() => {
    refetchData();
  }, [isUpdate, status]);

  if (isLoadingOther) {
    return <div>Loading...</div>;
  }

  if (isErrorOther) {
    return <div>Error loading data</div>;
  }

  const data = otherData;

  const orderDTOs: OrderDTO[] = data?.orderDTOs || [];

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      alert("Hủy đơn hàng thành công");
      setIsUpdate(!isUpdate);
    } catch (error) {
      alert("Hủy đơn hàng thất bại");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    // try {
    //   await completeOrder(orderId);
    //   alert("Hoàn thành đơn hàng thành công");
    //   setIsUpdate(!isUpdate);
    // } catch (error) {
    //   alert("Hoàn thành đơn hàng thất bại");
    // }
  };

  const handleReturnOrder = async (orderId: string) => {
    // try {
    //   await returnOrder(orderId);
    //   alert("Trả lại đơn hàng thành công");
    //   setIsUpdate(!isUpdate);
    // } catch (error) {
    //   alert("Trả lại đơn hàng thất bại");
    // }
    console.log("Return order");
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: "/user/account/history-purchase",
        search: createSearchParams({
          status: String(tab.status),
        }).toString(),
      }}
      className={cn(
        "flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center",
        {
          "border-orange-600 text-orange-600": status === tab.status,
          "border-b-black/10 text-gray-900": status !== tab.status,
        }
      )}
    >
      {tab.name}
    </Link>
  ));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="sticky top-0 flex rounded-t-sm shadow-sm">
          {purchaseTabsLink}
        </div>
        <div>
          {orderDTOs?.map((purchase) => (
            <div
              key={purchase.orderId}
              className="mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm"
            >
              {purchase.orderItemDTOs.map((item: OrderItemDTO) => (
                <NavLink
                  to={`/user/account/order/${purchase.orderId}`}
                  className="flex"
                  key={item.cartId}
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-20 w-20 object-cover"
                      src={item.productVariantDTO.productImage}
                      alt={item.productVariantDTO.productName}
                    />
                  </div>
                  <div className="ml-3 flex-grow overflow-hidden">
                    <div className="truncate">
                      {item.productVariantDTO.productName}
                    </div>
                    <div className="mt-3">x{item.quantity}</div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className="ml-2 truncate text-orange">
                      {formatPrice(item.quantity * item.price)} VNĐ
                    </span>
                  </div>
                </NavLink>
              ))}
              <div className="flex justify-end">
                <span className="mr-4">
                  Ngày đặt hàng: {formatDate(purchase.orderDate)}
                </span>
                {purchase.status === "PENDING" && (
                  <button
                    onClick={() => handleCancelOrder(purchase.orderId)}
                    type="button"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-yellow-500 hover:bg-yellow-100 hover:text-yellow-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-yellow-800/30 dark:hover:text-yellow-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Hủy
                  </button>
                )}
                {purchase.status === "DELIVERED" && (
                  <>
                    <button
                      onClick={() => handleCompleteOrder(purchase.orderId)}
                      type="button"
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-green-500 hover:bg-green-100 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-green-800/30 dark:hover:text-green-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
                    >
                      Hoàn thành
                    </button>
                    <button
                      onClick={() => handleReturnOrder(purchase.orderId)}
                      type="button"
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-red-500 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-red-800/30 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Trả lại
                    </button>
                  </>
                )}
                {purchase.status === "COMPLETED" && (
                  <>
                    <Link
                      to={`/review/${purchase.orderId}`}
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-blue-500 hover:bg-blue-100 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 mr-4"
                    >
                      Đánh giá
                    </Link>
                    <button
                      onClick={() => {
                        /* Implement re-order logic */
                      }}
                      type="button"
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-xl font-semibold rounded-lg border border-transparent text-green-500 hover:bg-green-100 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-green-800/30 dark:hover:text-green-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    >
                      Mua lại
                    </button>
                  </>
                )}
                <div className="mr-4">
                  <span>Tổng khuyến mãi</span>
                  <span className="ml-4 text-xl text-orange">
                    {formatPrice(
                      purchase.discountSystem + purchase.discountShop
                    )}{" "}
                    VNĐ
                  </span>
                </div>
                <div>
                  <span>Tổng giá tiền</span>
                  <span className="ml-4 text-xl text-orange">
                    {formatPrice(purchase.paymentTotal)} VNĐ
                  </span>
                </div>

                <div className="ml-4">
                  <span>
                    {" "}
                    Trạng thái:{" "}
                    {purchase?.status === "PENDING"
                      ? "Đang chờ xử lý"
                      : purchase?.status === "PROCESSING"
                        ? "Đang xử lý"
                        : purchase?.status === "PICKUP_PENDING"
                          ? "Chờ lấy hàng"
                          : purchase?.status === "SHIPPING"
                            ? "Đang giao hàng"
                            : purchase?.status === "DELIVERED"
                              ? "Đã giao hàng"
                              : purchase?.status === "COMPLETED"
                                ? "Hoàn thành"
                                : purchase?.status === "RETURNED"
                                  ? "Đã trả lại"
                                  : "Đã hủy"}
                  </span>
                </div>
              </div>
              <div className="h-[50px] bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
