import {apiSlice} from "@/redux/api.ts";
import {OrderStatus} from "@/utils/DTOs/extra/OrderStatus.ts";
import {PageOrderResponse} from "@/utils/DTOs/customer/response/PageOrderResponse.ts";
import {OrderResponse} from "@/utils/DTOs/customer/response/OrderResponse.ts";

export const OrderManagerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrderPageByStatusAndDate: builder.query<
            PageOrderResponse, { page: number; size: number; status: OrderStatus; startDate: string; endDate: string }>({
            query: ({page, size, status, startDate, endDate}) =>
                `/manager/order/page/status/${status}/date?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
        }),


        getOrderDetailByOrderId: builder.query<
            OrderResponse, { orderId: string }>({
            query: ({orderId}) =>
                `/manager/order/detail/${orderId}`,
        }),


    }),
});

export const {
    useGetOrderPageByStatusAndDateQuery,
    useGetOrderDetailByOrderIdQuery,
} = OrderManagerApiSlice;
