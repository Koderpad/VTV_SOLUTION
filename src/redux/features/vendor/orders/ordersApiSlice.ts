import { apiSlice } from "@/redux/api";
import { ListOrderResponse } from "@/utils/DTOs/vendor/orders/Response/ListOrderResponse";
import { OrderResponse } from "@/utils/DTOs/vendor/orders/Response/OrderResponse";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrderList: builder.query<ListOrderResponse, void>({
      query: () => ({
        url: "/vendor/order/list",
        method: "GET",
      }),
    }),
    getOrderListByStatus: builder.query<ListOrderResponse, { status: string }>({
      query: ({ status }) => ({
        url: `/vendor/order/list/status/${status}`,
        method: "GET",
      }),
    }),
    getOrderDetail: builder.query<OrderResponse, string>({
      query: (orderId) => ({
        url: `/vendor/order/detail/${orderId}`,
        method: "GET",
      }),
    }),
    updateOrderStatus: builder.mutation<
      OrderResponse,
      { orderId: string; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `/vendor/order/update/${orderId}/status/${status}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetOrderListQuery,
  useGetOrderListByStatusQuery,
  useGetOrderDetailQuery,
  useUpdateOrderStatusMutation,
} = ordersApiSlice;
