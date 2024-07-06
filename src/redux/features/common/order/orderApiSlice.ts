import { apiSlice } from "@/redux/api";
import { MultipleOrderRequestWithCart } from "@/utils/DTOs/common/Order/Request/MultipleOrderRequestWithCart";
import { MultipleOrderResponse } from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveOrder: builder.mutation({
      query: (body) => ({
        url: `/customer/order/save`,
        method: "POST",
        body,
      }),
    }),
    createOrder: builder.mutation({
      query: (cartIds: number[]) => ({
        url: `/customer/order/create?${cartIds
          .map((id) => `cartIds=${id}`)
          .join("&")}`,
        method: "GET",
      }),
    }),
    getOrderByOrderId: builder.query({
      query: (orderId: number) => `customer/order/detail/${orderId}`,
    }),
    getOrderByOrderIdMu: builder.mutation({
      query: (orderId: number) => ({
        url: `customer/order/detail/${orderId}`,
        method: "GET",
      }),
    }),

    getOrderByStatus: builder.query({
      query: (status: string) => `customer/order/list/status/${status}`,
    }),
    getOrderByStatusMu: builder.mutation({
      query: (status: string) => ({
        url: `customer/order/list/status/${status}`,
        method: "GET",
      }),
    }),

    createUpdateOrder: builder.mutation({
      query: ({
        cartIds,
        addressId,
        voucherSystemId,
        voucherShopId,
        note,
        paymentMethod,
        shippingMethod,
      }) => {
        let url = `/customer/order/create-update?cartIds=${cartIds}&addressId=${addressId}&note=${note}&paymentMethod=${paymentMethod}&shippingMethod=${shippingMethod}`;

        if (voucherSystemId != null) {
          url += `&voucherSystemId=${voucherSystemId}`;
        }

        if (voucherShopId != null) {
          url += `&voucherShopId=${voucherShopId}`;
        }

        return {
          url,
          method: "GET",
        };
      },
    }),

    // cancelOrder: builder.mutation({
    //   query: (orderId: number) => ({
    //     url: `/customer/order/cancel/${orderId}`,
    //     method: "POST",
    //   }),
    // }),
    getOrdersByCus: builder.query({
      query: () => `/customer/order/list`,
    }),

    getOrdersByStatusVer2: builder.query({
      query: (status: string) => {
        const base = "/customer/order/list";
        return status === "ALL" ? base : `${base}/status/${status}`;
      },
    }),

    getOrderItemByOrderItemId: builder.mutation({
      query: (orderItemId: number) => ({
        url: `/customer/order/order-item/detail/${orderItemId}`,
        method: "GET",
      }),
    }),

    createMultiOrder: builder.mutation<MultipleOrderResponse, string[]>({
      query: (cartIds) => ({
        url: `/customer/order/create/multiple/by-cartIds`,
        method: "POST",
        body: cartIds,
      }),
    }),
    updateMultiOrder: builder.mutation<
      MultipleOrderResponse,
      MultipleOrderRequestWithCart
    >({
      query: (body) => ({
        url: `/customer/order/create/multiple/by-request`,
        method: "POST",
        body,
      }),
    }),
    addMutilOrder: builder.mutation<
      MultipleOrderResponse,
      MultipleOrderRequestWithCart
    >({
      query: (body) => ({
        url: `/customer/order/add/multiple/by-request`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSaveOrderMutation,
  useCreateOrderMutation,
  useGetOrderByOrderIdQuery,
  useGetOrderByOrderIdMuMutation,
  useGetOrderByStatusQuery,
  useGetOrderByStatusMuMutation,
  useCreateUpdateOrderMutation,
  // useCancelOrderMutation,
  useGetOrdersByCusQuery,
  useGetOrdersByStatusVer2Query,
  useGetOrderItemByOrderItemIdMutation,
  useCreateMultiOrderMutation,
  useUpdateMultiOrderMutation,
  useAddMutilOrderMutation,
} = orderApiSlice;
